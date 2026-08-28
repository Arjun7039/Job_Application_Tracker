import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] grid place-items-center text-sm text-slate-400">
        <div className="flex items-center gap-3">
          <div className="size-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading workspace…</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}
