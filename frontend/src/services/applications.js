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
  const { data } = await api.get("/applications", { params: filters });
  return data;
}

export const getApplications = listApplications;

export async function getApplication(id) {
  if (DEMO_MODE) return demoStore.get(id);
  const { data } = await api.get(`/applications/${id}`);
  return data;
}

export async function createApplication(payload) {
  if (DEMO_MODE) return demoStore.create(payload);
  const { data } = await api.post("/applications", payload);
  return data;
}

export async function updateApplication(id, payload) {
  if (DEMO_MODE) return demoStore.update(id, payload);
  const { data } = await api.put(`/applications/${id}`, payload);
  return data;
}

export async function deleteApplication(id) {
  if (DEMO_MODE) return demoStore.remove(id);
  await api.delete(`/applications/${id}`);
}

export async function getStats() {
  if (DEMO_MODE) return demoStore.stats();
  const { data } = await api.get("/dashboard/stats");
  return data;
}
