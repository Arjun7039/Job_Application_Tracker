import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats, createApplication } from "../services/applications";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import StatusPill from "../components/StatusPill";
import CompanyMark from "../components/CompanyMark";
import ApplicationPanel from "../components/ApplicationPanel";
import { 
  Plus, 
  Briefcase, 
  Send, 
  MessageSquare, 
  FileCheck, 
  Trophy, 
  XCircle,
  ExternalLink,
  Calendar,
  Sparkles,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (payload) => {
    await createApplication(payload);
    await loadData();
  };

  const responseRate = stats?.total > 0 
    ? Math.round(((stats.interview + stats.assessment + stats.offer) / stats.total) * 100) 
    : 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Hero Welcome Header */}
      <div className="panel p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Executive Overview</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name || "Job Hunter"}</span>
          </h1>
          <p className="text-base text-slate-400 max-w-xl font-normal">
            Track your active interviews, application status breakdown, and response rates in real-time.
          </p>
        </div>

        <button onClick={() => setPanelOpen(true)} className="btn-primary py-3 px-6 text-base shadow-xl shadow-indigo-500/25 shrink-0">
          <Plus className="size-5" />
          <span>New Application</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        <StatCard
          label="Total Apps"
          value={stats?.total ?? 0}
          icon={Briefcase}
          footnote={`${responseRate}% response rate`}
        />
        <StatCard
          label="Applied"
          value={stats?.applied ?? 0}
          icon={Send}
          tone="applied"
        />
        <StatCard
          label="Interviews"
          value={stats?.interview ?? 0}
          icon={MessageSquare}
          tone="interview"
        />
        <StatCard
          label="Assessments"
          value={stats?.assessment ?? 0}
          icon={FileCheck}
          tone="assessment"
        />
        <StatCard
          label="Offers"
          value={stats?.offer ?? 0}
          icon={Trophy}
          tone="offer"
        />
        <StatCard
          label="Rejected"
          value={stats?.rejected ?? 0}
          icon={XCircle}
          tone="rejected"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications List */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Recent Applications</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {stats?.recent?.length || 0}
              </span>
            </h2>
            <Link to="/applications" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="panel divide-y divide-slate-800/80 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-base font-medium">Loading applications...</div>
            ) : !stats?.recent || stats.recent.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Briefcase className="size-12 text-slate-600 mx-auto" />
                <p className="text-slate-300 text-base font-semibold">No applications tracked yet</p>
                <p className="text-slate-500 text-sm">Add your first job application to populate your dashboard!</p>
              </div>
            ) : (
              stats.recent.map((app) => (
                <div key={app.id} className="p-5 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-5 group">
                  <div className="flex items-center gap-4 min-w-0">
                    <CompanyMark name={app.company} size="size-13" />
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {app.position}
                      </h3>
                      <p className="text-sm font-semibold text-slate-400 truncate">
                        {app.company} <span className="text-slate-600">•</span> {app.location || "Remote"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <StatusPill status={app.status} />
                    {app.job_url && (
                      <a
                        href={app.job_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Open Job Posting"
                      >
                        <ExternalLink className="size-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Side Analytics & Pipeline Health */}
        <div className="space-y-6">
          <div className="panel p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
              <TrendingUp className="size-5 text-indigo-400" />
              <span>Pipeline Health</span>
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-400">Response Rate</span>
                  <span className="text-indigo-400">{responseRate}%</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${responseRate}%` }} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Offers Received</span>
                  <span className="font-bold text-emerald-400 text-base">{stats?.offer || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Interviews Scheduled</span>
                  <span className="font-bold text-amber-400 text-base">{stats?.interview || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Assessments Pending</span>
                  <span className="font-bold text-indigo-400 text-base">{stats?.assessment || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Applied Roles</span>
                  <span className="font-bold text-sky-400 text-base">{stats?.applied || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side drawer for creation */}
      <ApplicationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
