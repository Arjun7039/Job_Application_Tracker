import csv
import io
import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from fastapi.responses import StreamingResponse, Response
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.engine import get_db
from app.models.user import User
from app.models.application import Application, JobTypeEnum, StatusEnum
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[ApplicationOut])
def list_applications(
    search: Optional[str] = Query(None, description="Search by company or position"),
    status: Optional[str] = Query(None, description="Filter by application status"),
    job_type: Optional[str] = Query(None, description="Filter by job type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Application).filter(Application.user_id == current_user.id)

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Application.company.ilike(term),
                Application.position.ilike(term)
            )
        )

    if status:
        try:
            status_enum = StatusEnum(status.lower())
            query = query.filter(Application.status == status_enum)
        except ValueError:
            pass

    if job_type:
        try:
            job_type_enum = JobTypeEnum(job_type.lower())
            query = query.filter(Application.job_type == job_type_enum)
        except ValueError:
            pass

    return query.order_by(Application.created_at.desc()).all()

@router.get("/export/csv")
def export_applications_csv(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).order_by(Application.created_at.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Company", "Position", "Location", "Job Type", "Status", "Application Date", "Interview Date", "Job URL", "Notes"])
    
    for app in apps:
        writer.writerow([
            app.id,
            app.company,
            app.position,
            app.location or "",
            app.job_type.value if hasattr(app.job_type, "value") else str(app.job_type),
            app.status.value if hasattr(app.status, "value") else str(app.status),
            app.application_date or "",
            app.interview_date.isoformat() if app.interview_date else "",
            app.job_url or "",
            app.notes or ""
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="job_applications_export.csv"'}
    )

@router.get("/export/calendar")
def export_applications_calendar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(Application).filter(
        Application.user_id == current_user.id,
        or_(Application.status == StatusEnum.interview, Application.status == StatusEnum.assessment)
    ).all()
    
    ics_lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//JobTrack//Career Compass Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH"
    ]
    
    for app in apps:
        dt = app.interview_date or app.created_at
        dt_str = dt.strftime("%Y%m%dT%H%M%SZ")
        summary = f"Interview / Assessment: {app.position} at {app.company}"
        description = f"Company: {app.company}\\nPosition: {app.position}\\nStatus: {app.status.value if hasattr(app.status, 'value') else app.status}\\nNotes: {app.notes or 'N/A'}"
        
        ics_lines.extend([
            "BEGIN:VEVENT",
            f"UID:jobtrack-{app.id}@{app.company.lower().replace(' ', '')}.com",
            f"DTSTAMP:{dt_str}",
            f"DTSTART:{dt_str}",
            f"SUMMARY:{summary}",
            f"DESCRIPTION:{description}",
            f"LOCATION:{app.location or 'Remote'}",
            "STATUS:CONFIRMED",
            "END:VEVENT"
        ])
        
    ics_lines.append("END:VCALENDAR")
    ics_content = "\r\n".join(ics_lines)
    
    return Response(
        content=ics_content,
        media_type="text/calendar",
        headers={"Content-Disposition": 'attachment; filename="interview_schedule.ics"'}
    )

@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = app_in.model_dump() if hasattr(app_in, "model_dump") else app_in.dict()
    application = Application(
        **data,
        user_id=current_user.id
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/{app_id}", response_model=ApplicationOut)
def get_application(
    app_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    return application

@router.put("/{app_id}", response_model=ApplicationOut)
def update_application(
    app_id: int,
    app_in: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    update_data = app_in.model_dump(exclude_unset=True) if hasattr(app_in, "model_dump") else app_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)
    return application

@router.post("/{app_id}/resume", response_model=ApplicationOut)
async def upload_resume(
    app_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    ext = os.path.splitext(file.filename)[1]
    saved_filename = f"resume_{app_id}_{uuid.uuid4().hex[:8]}{ext}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    application.resume_filename = saved_filename
    db.commit()
    db.refresh(application)
    return application

@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    app_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    db.delete(application)
    db.commit()
    return None
