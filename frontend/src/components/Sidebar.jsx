import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronRight
} from "lucide-react";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applications", label: "Applications", icon: Briefcase },
  { to: "/interviews", label: "Interviews", icon: Calendar },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initials = (user?.name || "User")
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="w-72 border-r border-slate-800/80 bg-[#0b132b]/95 backdrop-blur-2xl flex flex-col shrink-0 h-screen sticky top-0 z-30 shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3.5">
          <div className="size-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl grid place-items-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block leading-none">JobTrack</span>
            <span className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase mt-1 block">Career Compass</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Main Navigation</p>
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              <div className="flex items-center gap-3.5">
                <Icon className="size-5 transition-transform duration-200 group-hover:scale-110" />
                <span>{link.label}</span>
              </div>
              <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-sm font-extrabold text-white shrink-0 shadow-md shadow-indigo-500/20">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
