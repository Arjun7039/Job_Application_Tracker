import React from "react";
import { useAuth } from "../context/AuthContext";
import { exportCSV, exportCalendar } from "../services/applications";
import { User, Shield, Server, Database, Sparkles, CheckCircle2, Download, Calendar } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "Local Standalone Demo Mode";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-base text-slate-400 mt-1">Manage your account credentials, security configuration, and database connection status.</p>
      </div>

      <div className="space-y-6">
        {/* User Account Details */}
        <div className="panel p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 grid place-items-center text-indigo-400">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Account Information</h2>
              <p className="text-xs text-slate-400">Your profile information and authentication status.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
              <p className="text-base font-bold text-white">{user?.name || "N/A"}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
              <p className="text-base font-bold text-white">{user?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Data Backup & Export Shortcuts */}
        <div className="panel p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400">
              <Download className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Data Export & Backup</h2>
              <p className="text-xs text-slate-400">Download offline backups or sync interview schedules to calendar apps.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={exportCSV}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="text-sm font-bold text-white group-hover:text-emerald-300">Export Application Records (.csv)</p>
                <p className="text-xs text-slate-400 mt-0.5">Compatible with Excel, Google Sheets, & Numbers</p>
              </div>
              <Download className="size-5 text-emerald-400 shrink-0 ml-3" />
            </button>

            <button
              onClick={exportCalendar}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="text-sm font-bold text-white group-hover:text-indigo-300">Sync Interview Calendar (.ics)</p>
                <p className="text-xs text-slate-400 mt-0.5">Import into Apple Calendar, Google, or Outlook</p>
              </div>
              <Calendar className="size-5 text-indigo-400 shrink-0 ml-3" />
            </button>
          </div>
        </div>

        {/* Backend Connectivity Status */}
        <div className="panel p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/20 grid place-items-center text-purple-400">
              <Server className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">System Infrastructure</h2>
              <p className="text-xs text-slate-400">Active API connection and environment information.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">API Endpoint</span>
                <p className="text-sm font-mono font-semibold text-indigo-300 mt-1">{apiBaseUrl}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Engine</span>
                <p className="text-sm font-semibold text-white mt-1">PostgreSQL (Supabase) / SQLite Fallback</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                SQLAlchemy 2.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
