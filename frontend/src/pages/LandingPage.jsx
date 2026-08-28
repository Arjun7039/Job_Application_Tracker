import React from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Layers,
  ChevronRight,
  Send,
  MessageSquare,
  Trophy
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl grid place-items-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white block leading-none">JobTrack</span>
            <span className="text-[10px] font-semibold tracking-widest text-indigo-400 uppercase">Career Compass</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="btn-primary text-sm px-4 py-2"
          >
            <span>Get Started</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20 w-full flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
            <Zap className="size-3.5 text-indigo-400" />
            <span>Smart Career Pipeline Management</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Master Your Job Search with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Clarity & Control</span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Organize every application, track interview schedules, monitor response rates, and land your dream offer with our modern, high-performance job tracker.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register" className="btn-primary w-full sm:w-auto px-8 py-3 text-base shadow-xl shadow-indigo-500/20">
              <span>Start Tracking Free</span>
              <ArrowRight className="size-5" />
            </Link>
            <Link to="/login" className="btn-secondary w-full sm:w-auto px-8 py-3 text-base">
              <span>Sign In to Account</span>
            </Link>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" /> Free & Open Setup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" /> Fast Supabase PostgreSQL Backend
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" /> Standalone Demo Fallback
            </span>
          </div>
        </div>

        {/* Dynamic UI Preview Card */}
        <div className="mt-14 max-w-5xl mx-auto w-full">
          <div className="panel p-6 md:p-8 backdrop-blur-2xl bg-[#0f172a]/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-rose-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-500 font-mono ml-2">JobTrack Overview — Dashboard Preview</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Live Interface</span>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Applied</p>
                <p className="text-2xl font-bold text-sky-400 mt-1">24</p>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Interviews</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">6</p>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assessments</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">3</p>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Offers</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">2</p>
              </div>
            </div>

            {/* Sample Table Preview */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden divide-y divide-slate-800/60">
              <div className="p-3.5 flex items-center justify-between text-xs text-slate-400 font-semibold bg-slate-900/40">
                <span>Company & Position</span>
                <span>Status</span>
              </div>
              <div className="p-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white font-bold">V</div>
                  <div>
                    <p className="font-semibold text-white">Senior Frontend Engineer</p>
                    <p className="text-slate-400 text-[11px]">Vercel • San Francisco, CA</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Offer Received</span>
              </div>

              <div className="p-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 grid place-items-center text-white font-bold">L</div>
                  <div>
                    <p className="font-semibold text-white">Product Designer</p>
                    <p className="text-slate-400 text-[11px]">Linear • Remote</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Interview Scheduled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="panel p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 grid place-items-center text-indigo-400">
              <Briefcase className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Full Application Lifecycle</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track job status from initial application to online assessment, technical interview, and final offer letter.
            </p>
          </div>

          <div className="panel p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/20 grid place-items-center text-purple-400">
              <BarChart3 className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Live Search & Smart Filters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly search through roles, companies, or filter by full-time, internship, or contract types.
            </p>
          </div>

          <div className="panel p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Production Ready & Secure</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by FastAPI and Supabase PostgreSQL with JWT authentication and password hashing.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg grid place-items-center text-white text-xs font-bold">J</div>
            <span className="font-semibold text-slate-300">JobTrack</span>
            <span>— Career Compass</span>
          </div>
          <p>© {new Date().getFullYear()} JobTrack. Production Ready Application.</p>
        </div>
      </footer>
    </div>
  );
}
