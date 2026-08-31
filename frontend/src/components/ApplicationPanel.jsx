import React, { useState, useEffect } from "react";
import { X, Sparkles, Save, Paperclip, FileText, Calendar } from "lucide-react";
import CompanyMark from "./CompanyMark";
import { uploadResume } from "../services/applications";

const JOB_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
];

const STATUSES = [
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "assessment", label: "Assessment" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

export default function ApplicationPanel({ open, onClose, onSubmit, initialData }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("full_time");
  const [status, setStatus] = useState("applied");
  const [jobUrl, setJobUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [appDate, setAppDate] = useState(new Date().toISOString().split("T")[0]);
  const [interviewDate, setInterviewDate] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFilename, setResumeFilename] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || "");
      setPosition(initialData.position || "");
      setLocation(initialData.location || "");
      setJobType(initialData.job_type || "full_time");
      setStatus(initialData.status || "applied");
      setJobUrl(initialData.job_url || "");
      setNotes(initialData.notes || "");
      setAppDate(
        initialData.application_date 
          ? new Date(initialData.application_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setInterviewDate(
        initialData.interview_date
          ? new Date(initialData.interview_date).toISOString().slice(0, 16)
          : ""
      );
      setResumeFilename(initialData.resume_filename || "");
      setResumeFile(null);
    } else {
      setCompany("");
      setPosition("");
      setLocation("");
      setJobType("full_time");
      setStatus("applied");
      setJobUrl("");
      setNotes("");
      setAppDate(new Date().toISOString().split("T")[0]);
      setInterviewDate("");
      setResumeFilename("");
      setResumeFile(null);
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    setSubmitting(true);
    try {
      const savedApp = await onSubmit({
        company: company.trim(),
        position: position.trim(),
        location: location.trim() || null,
        job_type: jobType,
        status,
        job_url: jobUrl.trim() || null,
        notes: notes.trim() || null,
        application_date: appDate,
        interview_date: interviewDate ? new Date(interviewDate).toISOString() : null,
      });

      const targetId = savedApp?.id || initialData?.id;
      if (targetId && resumeFile) {
        await uploadResume(targetId, resumeFile);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-md flex justify-end transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0b132b] border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <CompanyMark name={company || "?"} size="size-11" />
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {initialData ? "Edit Job Application" : "Track New Application"}
              </h2>
              <p className="text-xs text-slate-400">Fill in role details to update your pipeline.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="field-label">Company Name *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Vercel, Stripe, Google"
                className="field"
              />
            </div>

            <div>
              <label className="field-label">Position Title *</label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="field-label">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
                className="field"
              />
            </div>

            <div>
              <label className="field-label">Application Date</label>
              <input
                type="date"
                value={appDate}
                onChange={(e) => setAppDate(e.target.value)}
                className="field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="field-label">Employment Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="field bg-slate-900 cursor-pointer"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Current Pipeline Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="field bg-slate-900 cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="field-label">Scheduled Interview / Event Date</label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="field"
              />
            </div>

            <div>
              <label className="field-label">Resume Attachment (PDF / DOCX)</label>
              <label className="field cursor-pointer flex items-center justify-between hover:border-indigo-500/50">
                <span className="truncate text-slate-300 text-xs font-semibold">
                  {resumeFile ? resumeFile.name : resumeFilename || "Upload Resume File..."}
                </span>
                <Paperclip className="size-4 text-indigo-400 shrink-0 ml-2" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setResumeFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="field-label">Job Posting URL (Optional)</label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://company.com/careers/role"
              className="field"
            />
          </div>

          <div>
            <label className="field-label">Notes & Interview Details</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add interview dates, recruiter contact, salary range, or tech stack details..."
              className="field py-3 resize-none"
            />
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary py-3 px-5">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary py-3 px-6 shadow-xl shadow-indigo-500/30">
              <Save className="size-5" />
              <span>{submitting ? "Saving..." : initialData ? "Update Application" : "Create Application"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
