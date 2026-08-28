from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.engine import get_db
from app.models.user import User
from app.models.application import Application, JobTypeEnum, StatusEnum
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

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

@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = Application(
        **app_in.dict(),
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

    update_data = app_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)

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
