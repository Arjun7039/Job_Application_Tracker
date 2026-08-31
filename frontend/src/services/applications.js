import api, { DEMO_MODE } from "./api";
import { demoStore } from "./demoStore";

export const STATUSES = [
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "assessment", label: "Assessment" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

export const JOB_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
];

export async function listApplications(filters = {}) {
  if (DEMO_MODE) return demoStore.list(filters);
  const { data } = await api.get("/api/applications", { params: filters });
  return data;
}

export const getApplications = listApplications;

export async function getApplication(id) {
  if (DEMO_MODE) return demoStore.get(id);
  const { data } = await api.get(`/api/applications/${id}`);
  return data;
}

export async function createApplication(payload) {
  if (DEMO_MODE) return demoStore.create(payload);
  const { data } = await api.post("/api/applications", payload);
  return data;
}

export async function updateApplication(id, payload) {
  if (DEMO_MODE) return demoStore.update(id, payload);
  const { data } = await api.put(`/api/applications/${id}`, payload);
  return data;
}

export async function deleteApplication(id) {
  if (DEMO_MODE) return demoStore.remove(id);
  await api.delete(`/api/applications/${id}`);
}

export async function getStats() {
  if (DEMO_MODE) return demoStore.stats();
  const { data } = await api.get("/api/dashboard/stats");
  return data;
}

export async function exportCSV() {
  if (DEMO_MODE) return demoStore.exportCSV();
  const response = await api.get("/api/applications/export/csv", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "job_applications_export.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function exportCalendar() {
  if (DEMO_MODE) return demoStore.exportCalendar();
  const response = await api.get("/api/applications/export/calendar", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "interview_schedule.ics");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function uploadResume(id, file) {
  if (DEMO_MODE) return demoStore.uploadResume(id, file);
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/api/applications/${id}/resume`, formData);
  return data;
}
