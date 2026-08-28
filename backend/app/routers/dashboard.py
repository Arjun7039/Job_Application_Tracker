from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.engine import get_db
from app.models.user import User
from app.models.application import Application, StatusEnum
from app.schemas.application import ApplicationOut
from app.dependencies.auth import get_current_user
from typing import List, Dict, Any

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=Dict[str, Any])
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    
    def count(status: StatusEnum) -> int:
        return sum(1 for a in apps if a.status == status)

    recent = (
        db.query(Application)
        .filter(Application.user_id == current_user.id)
        .order_by(Application.created_at.desc())
        .limit(5)
        .all()
    )

    recent_out = [
        ApplicationOut.model_validate(a) if hasattr(ApplicationOut, "model_validate") else ApplicationOut.from_orm(a) 
        for a in recent
    ]

    return {
        "total": len(apps),
        "applied": count(StatusEnum.applied),
        "interview": count(StatusEnum.interview),
        "assessment": count(StatusEnum.assessment),
        "offer": count(StatusEnum.offer),
        "rejected": count(StatusEnum.rejected),
        "withdrawn": count(StatusEnum.withdrawn),
        "recent": recent_out,
    }
