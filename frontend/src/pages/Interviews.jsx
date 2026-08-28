import React, { useEffect, useState } from "react";
import { getApplications } from "../services/applications";
import CompanyMark from "../components/CompanyMark";
import StatusPill from "../components/StatusPill";
import { Calendar, Clock, FileText, MessageSquare, ExternalLink } from "lucide-react";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInterviews() {
      setLoading(true);
      try {
        const allApps = await getApplications();
        const activeInterviews = allApps.filter(
          (app) => app.status === "interview" || app.status === "assessment"
        );
        setInterviews(activeInterviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInterviews();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Interviews & Assessments</h1>
        <p className="text-base text-slate-400 mt-1">Track upcoming technical evaluations, behavioral interviews, and screening calls.</p>
      </div>

      {loading ? (
        <div className="panel p-16 text-center text-slate-400 font-medium">Loading interview schedule...</div>
      ) : interviews.length === 0 ? (
        <div className="panel p-16 text-center space-y-4">
          <MessageSquare className="size-14 text-slate-600 mx-auto" />
          <p className="text-xl font-bold text-white">No active interviews scheduled</p>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            When you update an application's status to "Interview" or "Assessment", it will automatically appear in your schedule timeline here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((item) => (
            <div key={item.id} className="panel p-6 space-y-5 hover:border-indigo-500/40 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <CompanyMark name={item.company} size="size-14" />
                  <div>
                    <h2 className="text-lg font-extrabold text-white">{item.position}</h2>
                    <p className="text-base font-semibold text-slate-300">{item.company}</p>
                  </div>
                </div>
                <StatusPill status={item.status} />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Calendar className="size-4" />
                  <span>Date: {item.application_date ? new Date(item.application_date).toLocaleDateString() : "Scheduled"}</span>
                </div>
                {item.notes ? (
                  <div className="flex items-start gap-2 pt-1 text-slate-300">
                    <FileText className="size-4 text-slate-500 shrink-0 mt-1" />
                    <p className="text-sm font-medium">{item.notes}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No notes added yet.</p>
                )}
              </div>

              {item.job_url && (
                <div className="pt-2 flex justify-end">
                  <a
                    href={item.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary py-2 px-3 text-xs"
                  >
                    <ExternalLink className="size-4" />
                    <span>View Job Details</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
