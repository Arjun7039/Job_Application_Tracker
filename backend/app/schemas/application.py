from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.application import JobTypeEnum, StatusEnum

class ApplicationBase(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    job_type: Optional[JobTypeEnum] = JobTypeEnum.full_time
    application_date: Optional[str] = None
    status: Optional[StatusEnum] = StatusEnum.applied
    job_url: Optional[str] = None
    notes: Optional[str] = None
    interview_date: Optional[datetime] = None
    resume_filename: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[JobTypeEnum] = None
    application_date: Optional[str] = None
    status: Optional[StatusEnum] = None
    job_url: Optional[str] = None
    notes: Optional[str] = None
    interview_date: Optional[datetime] = None
    resume_filename: Optional[str] = None

class ApplicationOut(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
