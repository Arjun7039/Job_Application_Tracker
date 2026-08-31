# 🚀 JobTrack — Full-Stack Job & Internship Application Tracker

**JobTrack** is a modern, production-ready full-stack web application designed to track job applications, interviews, assessments, and offer letters. Built with a **FastAPI (Python)** REST backend, **Supabase PostgreSQL** database, and a sleek **React (Vite) + Tailwind CSS** dark-mode frontend.

---

## ✨ Features

- 🌟 **Landing Page**: Modern landing page showcasing application pipeline management.
- 🔐 **Secure Authentication**: User registration and login using JWT tokens (HS256) and `bcrypt` password hashing.
- 📊 **Executive Dashboard**: Key metric cards (Total Applications, Applied, Interviews, Assessments, Offers, Rejected) with response rate calculation.
- 🔍 **Live Search & Filtering**: Debounced search by role or company, with status tabs and job-type filters.
- 🗂️ **Slide-Over Panel**: Fast inline creation and editing of applications via responsive slide-over drawer.
- 📅 **Interview & Assessment Calendar Sync**: Schedule interview dates and export standard `.ics` calendar files for Google, Apple, and Outlook calendars.
- 📎 **Resume File Attachments**: Upload and attach custom PDF/DOCX resumes per job application.
- 📥 **Instant CSV Export**: Download your entire job application pipeline in standard `.csv` spreadsheet format for offline reporting.
- ⚡ **Dual Engine / Demo Mode**: Works seamlessly connected to the FastAPI REST backend or as a standalone app using browser `localStorage`.
- ☁️ **Cloud Deployment Ready**: Ready for Vercel (Frontend) and Render (Backend + Supabase PostgreSQL).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS v4, Lucide Icons, Axios, React Router v6
- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic v2, Passlib (bcrypt), PyJWT/Python-Jose
- **Database**: PostgreSQL (Supabase) for production / SQLite for local development
- **Deployment**: Vercel (`vercel.json`) & Render (`render.yaml` / `Dockerfile`)

---

## 📁 Repository Architecture

```
JOB_Application_Tracker/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI core app & CORS configuration
│   │   ├── core/                # Environment config & security / JWT
│   │   ├── db/                  # Engine session & Base model
│   │   ├── models/              # User & Application SQL ORM models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── routers/             # Auth, Applications, Dashboard API routes
│   │   └── dependencies/        # OAuth2 token authentication dependency
│   ├── tests/                   # Pytest test suite for auth & CRUD
│   ├── .env.example
│   ├── Dockerfile
│   ├── render.yaml
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Sidebar, AppLayout, StatCard, StatusPill, CompanyMark, ApplicationPanel
│   │   ├── pages/               # LandingPage, Login, Register, Dashboard, Applications, Interviews, Settings
│   │   ├── context/             # AuthContext provider
│   │   ├── services/            # Axios API layer & demoStore fallback
│   │   ├── App.jsx              # Routing definition
│   │   └── index.css            # Tailwind CSS v4 design system
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Backend Setup (FastAPI + SQLite/PostgreSQL)

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```
- **API URL**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)

Open a second terminal window:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
- **Web App**: `http://localhost:5173`

---

## ☁️ Deployment Instructions

### Deploy Backend to Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository and set the root directory to `backend`.
3. Set Environment Variables in Render:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string (`postgresql://postgres.[REF]:[PASS]@[HOST]:6543/postgres`)
   - `SECRET_KEY`: Generate a secure random string.
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://job-tracker.vercel.app`).

### Deploy Frontend to Vercel

1. Import the repository on [Vercel](https://vercel.com).
2. Set the Root Directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://jobtrack-backend.onrender.com`).
4. Click **Deploy**. Vercel will automatically build the Vite app using `vercel.json` SPA routing rules.
