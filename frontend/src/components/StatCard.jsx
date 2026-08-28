import React from "react";

export default function StatCard({ label, value, icon: Icon, footnote, tone = "default", progress }) {
  const valueTone = {
    default: "text-white",
    applied: "text-sky-400",
    interview: "text-amber-400",
    assessment: "text-indigo-400",
    offer: "text-emerald-400",
    rejected: "text-rose-400",
  }[tone] || "text-white";

  const iconBg = {
    default: "bg-slate-800 text-slate-300",
    applied: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    interview: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    assessment: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    offer: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  }[tone] || "bg-slate-800 text-slate-300";

  return (
    <div className="panel p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="size-5" />
          </div>
        )}
      </div>
      <p className={`text-4xl font-extrabold ${valueTone} tracking-tight`}>{value}</p>
      
      {typeof progress === "number" ? (
        <div className="mt-4 w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : footnote ? (
        <div className="mt-3 text-xs font-semibold text-slate-400">{footnote}</div>
      ) : null}
    </div>
  );
}
