import React from "react";

const STYLES = {
  applied: "bg-sky-500/15 text-sky-300 ring-sky-500/30 border border-sky-500/20",
  interview: "bg-amber-500/15 text-amber-300 ring-amber-500/30 border border-amber-500/20",
  assessment: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/30 border border-indigo-500/20",
  offer: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30 border border-emerald-500/20 shadow-sm shadow-emerald-500/10",
  rejected: "bg-rose-500/15 text-rose-300 ring-rose-500/30 border border-rose-500/20",
  withdrawn: "bg-slate-500/15 text-slate-400 ring-slate-500/30 border border-slate-500/20",
};

export const STATUS_LABELS = {
  applied: "Applied",
  interview: "Interview",
  assessment: "Assessment",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export default function StatusPill({ status }) {
  const normalized = (status || "applied").toLowerCase();
  const label = STATUS_LABELS[normalized] || status;
  const style = STYLES[normalized] || STYLES.applied;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${style}`}
    >
      <span className="size-2 rounded-full bg-current mr-2 animate-pulse" />
      {label}
    </span>
  );
}
