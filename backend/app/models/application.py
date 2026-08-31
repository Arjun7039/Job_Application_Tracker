import enum
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db.base import Base

class JobTypeEnum(str, enum.Enum):
    full_time = "full_time"
    part_time = "part_time"
    internship = "internship"
    contract = "contract"

class StatusEnum(str, enum.Enum):
    applied = "applied"
    interview = "interview"
    assessment = "assessment"
    offer = "offer"
    rejected = "rejected"
    withdrawn = "withdrawn"

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)
    location = Column(String, nullable=True)
    job_type = Column(SQLEnum(JobTypeEnum), default=JobTypeEnum.full_time, nullable=False)
    application_date = Column(String, nullable=True)
    status = Column(SQLEnum(StatusEnum), default=StatusEnum.applied, nullable=False)
    job_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    interview_date = Column(DateTime, nullable=True)
    resume_filename = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="applications")
