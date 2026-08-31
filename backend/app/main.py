from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.core.config import settings
from app.db.engine import engine
from app.db.base import Base
import app.models  # Ensure models are imported before create_all

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JobTrack API",
    description="Full-stack Job Application Tracker REST API",
    version="1.0.0"
)

# Ensure uploads directory exists and mount static files
upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Configure production-ready CORS middleware
raw_origins = [o.strip() for o in settings.FRONTEND_URL.split(",") if o.strip()]
origins = list(set(raw_origins + [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Supports Vercel preview & production deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from app.routers import auth, applications, dashboard

app.include_router(auth.router, prefix="/api")
app.include_router(applications.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Welcome to JobTrack API",
        "docs": "/docs",
        "version": "1.0.0"
    }
