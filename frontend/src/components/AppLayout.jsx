import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex selection:bg-indigo-500 selection:text-white">
      <Sidebar />
      <main className="flex-1 min-w-0 px-6 lg:px-12 py-8 overflow-y-auto max-w-[1600px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
