import React, { useEffect, useState } from "react";
import { getApplications, updateApplication, exportCalendar } from "../services/applications";
import CompanyMark from "../components/CompanyMark";
import StatusPill from "../components/StatusPill";
import ApplicationPanel from "../components/ApplicationPanel";
import { Calendar, Clock, FileText, MessageSquare, ExternalLink, Download, Edit3 } from "lucide-react";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApp, setEditingApp] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const loadInterviews = async () => {
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
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleUpdate = async (payload) => {
    if (editingApp) {
      await updateApplication(editingApp.id, payload);
      setEditingApp(null);
      await loadInterviews();
    }
  };

  const openEdit = (app) => {
    setEditingApp(app);
    setPanelOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Interviews & Assessments Schedule</h1>
          <p className="text-base text-slate-400 mt-1">
            Track upcoming technical evaluations, behavioral interviews, and screening dates.
          </p>
        </div>

        <button
          onClick={exportCalendar}
          className="btn-primary py-3 px-6 text-base shadow-xl shadow-indigo-500/25 shrink-0"
        >
          <Download className="size-5" />
          <span>Sync Calendar (.ics)</span>
        </button>
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
          {interviews.map((item) => {
            const dateObj = item.interview_date ? new Date(item.interview_date) : null;
            const formattedDate = dateObj
              ? dateObj.toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : item.application_date
              ? new Date(item.application_date).toLocaleDateString()
              : "Date Pending";

            return (
              <div key={item.id} className="panel p-6 space-y-5 hover:border-indigo-500/40 transition-colors flex flex-col justify-between">
                <div className="space-y-4">
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
                      <span>Schedule: {formattedDate}</span>
                    </div>
                    {item.notes ? (
                      <div className="flex items-start gap-2 pt-1 text-slate-300">
                        <FileText className="size-4 text-slate-500 shrink-0 mt-1" />
                        <p className="text-sm font-medium">{item.notes}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No preparation notes added yet.</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <button
                    onClick={() => openEdit(item)}
                    className="btn-secondary py-2 px-3 text-xs"
                    title="Edit Interview Details"
                  >
                    <Edit3 className="size-4" />
                    <span>Edit Schedule</span>
                  </button>

                  {item.job_url && (
                    <a
                      href={item.job_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary py-2 px-3 text-xs"
                    >
                      <ExternalLink className="size-4" />
                      <span>Posting</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Drawer */}
      <ApplicationPanel
        open={panelOpen}
        initialData={editingApp}
        onClose={() => {
          setPanelOpen(false);
          setEditingApp(null);
        }}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
