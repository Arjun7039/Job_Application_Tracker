import React, { useEffect, useState } from "react";
import { getApplications, createApplication, updateApplication, deleteApplication } from "../services/applications";
import StatusPill, { STATUS_LABELS } from "../components/StatusPill";
import CompanyMark from "../components/CompanyMark";
import ApplicationPanel from "../components/ApplicationPanel";
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Briefcase, 
  MapPin, 
  Calendar,
  X
} from "lucide-react";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  // Panel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await getApplications({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        job_type: jobTypeFilter !== "all" ? jobTypeFilter : undefined,
      });
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchApps, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, jobTypeFilter]);

  const handleCreateOrUpdate = async (payload) => {
    if (editingApp) {
      await updateApplication(editingApp.id, payload);
    } else {
      await createApplication(payload);
    }
    setEditingApp(null);
    await fetchApps();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job application record?")) {
      await deleteApplication(id);
      await fetchApps();
    }
  };

  const openCreate = () => {
    setEditingApp(null);
    setPanelOpen(true);
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Job Applications</h1>
          <p className="text-base text-slate-400 mt-1">Manage and track your active job search applications.</p>
        </div>

        <button onClick={openCreate} className="btn-primary py-3 px-6 text-base shadow-xl shadow-indigo-500/25 shrink-0">
          <Plus className="size-5" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="panel p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="size-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by position, company, or location..."
              className="field pl-11 pr-10 py-3 text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Job Type Dropdown */}
          <div className="w-full lg:w-56 shrink-0">
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="field py-3 text-base bg-slate-900 cursor-pointer"
            >
              <option value="all">All Employment Types</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${
              statusFilter === "all"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            All ({applications.length})
          </button>
          {Object.keys(STATUS_LABELS).map((stKey) => (
            <button
              key={stKey}
              onClick={() => setStatusFilter(stKey)}
              className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                statusFilter === stKey
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {STATUS_LABELS[stKey]}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Data List */}
      <div className="panel divide-y divide-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-base font-medium">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Briefcase className="size-14 text-slate-600 mx-auto" />
            <p className="text-xl font-bold text-white">No applications match your criteria</p>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Try adjusting your search query or filters to find specific records.
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="p-6 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="flex items-start gap-4 min-w-0">
                <CompanyMark name={app.company} size="size-14" />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                      {app.position}
                    </h2>
                    <StatusPill status={app.status} />
                  </div>

                  <p className="text-base font-semibold text-slate-300">
                    {app.company}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 flex-wrap pt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4 text-indigo-400" />
                      {app.location || "Remote"}
                    </span>
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                      {(app.job_type || "full_time").replace("_", " ")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-4 text-slate-500" />
                      Applied: {app.application_date ? new Date(app.application_date).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                {app.job_url && (
                  <a
                    href={app.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary py-2 px-3 text-xs"
                    title="View Job Link"
                  >
                    <ExternalLink className="size-4" />
                    <span>Posting</span>
                  </a>
                )}
                <button
                  onClick={() => openEdit(app)}
                  className="btn-secondary py-2 px-3 text-xs"
                  title="Edit Record"
                >
                  <Edit3 className="size-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Application"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Side drawer for creating/editing */}
      <ApplicationPanel
        open={panelOpen}
        initialData={editingApp}
        onClose={() => {
          setPanelOpen(false);
          setEditingApp(null);
        }}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
}
