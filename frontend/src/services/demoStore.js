/**
 * Browser-backed stand-in for the FastAPI backend, used only in demo mode
 * (when VITE_API_URL is unset). Mirrors the real REST contract.
 */
const USERS_KEY = "jobtrack_demo_users";
const APPS_KEY = "jobtrack_demo_applications";
const SESSION_KEY = "jobtrack_demo_session";

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const SEED = [
  {
    company: "Vercel",
    position: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    job_type: "full_time",
    status: "offer",
    application_date: daysAgo(21),
    job_url: "https://vercel.com/careers",
    notes: "Final round went well. Offer received — comparing with Linear.",
  },
  {
    company: "Linear",
    position: "Product Designer",
    location: "Remote",
    job_type: "contract",
    status: "interview",
    application_date: daysAgo(14),
    job_url: "https://linear.app/careers",
    notes: "Design system deep dive scheduled for tomorrow at 10:00 AM.",
  },
  {
    company: "Stripe",
    position: "Fullstack Developer",
    location: "Dublin, IE",
    job_type: "full_time",
    status: "applied",
    application_date: daysAgo(9),
    job_url: "https://stripe.com/jobs",
    notes: "Referred by Sarah. Follow up with the recruiter this week.",
  },
  {
    company: "Supabase",
    position: "Platform Engineer",
    location: "Remote",
    job_type: "full_time",
    status: "assessment",
    application_date: daysAgo(7),
    job_url: "https://supabase.com/careers",
    notes: "Take-home assessment due Friday.",
  },
  {
    company: "Anthropic",
    position: "AI Research Intern",
    location: "London, UK",
    job_type: "internship",
    status: "rejected",
    application_date: daysAgo(30),
    job_url: "",
    notes: "Rejected after screening — reapply next cycle.",
  },
  {
    company: "Notion",
    position: "Frontend Intern",
    location: "Remote",
    job_type: "internship",
    status: "applied",
    application_date: daysAgo(4),
    job_url: "https://notion.so/careers",
    notes: "",
  },
  {
    company: "Figma",
    position: "Design Engineer",
    location: "New York, NY",
    job_type: "part_time",
    status: "withdrawn",
    application_date: daysAgo(40),
    job_url: "",
    notes: "Withdrew — timing did not work out.",
  },
];

function seedFor(userId) {
  const now = new Date().toISOString();
  return SEED.map((item, index) => ({
    id: index + 1,
    user_id: userId,
    created_at: now,
    updated_at: now,
    ...item,
  }));
}

export const demoStore = {
  register({ name, email, password }) {
    const users = read(USERS_KEY, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with that email already exists");
    }
    const user = { id: 100 + users.length, name, email, password };
    users.push(user);
    write(USERS_KEY, users);
    write(APPS_KEY, [...read(APPS_KEY, []), ...seedFor(user.id)]);
    return this.login({ email, password });
  },

  login({ email, password }) {
    const users = read(USERS_KEY, []);
    let user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    
    // Auto-create demo user if none exists
    if (!user && users.length === 0) {
      user = { id: 1, name: nameFromEmail(email) || "Demo User", email, password };
      users.push(user);
      write(USERS_KEY, users);
      write(APPS_KEY, seedFor(user.id));
    } else if (!user) {
      throw new Error("Invalid email or password");
    }

    const token = `demo.${user.id}`;
    write(SESSION_KEY, { token, userId: user.id });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  },

  me() {
    const session = read(SESSION_KEY, null);
    if (!session) throw new Error("Not authenticated");
    const user = read(USERS_KEY, []).find((u) => u.id === session.userId);
    if (!user) throw new Error("Not authenticated");
    return { id: user.id, name: user.name, email: user.email };
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  currentUserId() {
    return read(SESSION_KEY, null)?.userId ?? null;
  },

  list({ search = "", status = "", job_type = "" } = {}) {
    const userId = this.currentUserId();
    const term = search.trim().toLowerCase();
    return read(APPS_KEY, [])
      .filter((a) => a.user_id === userId)
      .filter((a) =>
        term
          ? a.company.toLowerCase().includes(term) || a.position.toLowerCase().includes(term)
          : true,
      )
      .filter((a) => (status ? a.status.toLowerCase() === status.toLowerCase() : true))
      .filter((a) => (job_type ? a.job_type.toLowerCase() === job_type.toLowerCase() : true))
      .sort((a, b) => (a.application_date < b.application_date ? 1 : -1));
  },

  get(id) {
    const app = read(APPS_KEY, []).find(
      (a) => Number(a.id) === Number(id) && a.user_id === this.currentUserId(),
    );
    if (!app) throw new Error("Application not found");
    return app;
  },

  create(payload) {
    const now = new Date().toISOString();
    const apps = read(APPS_KEY, []);
    const app = {
      id: Date.now(),
      user_id: this.currentUserId(),
      created_at: now,
      updated_at: now,
      ...payload,
    };
    write(APPS_KEY, [app, ...apps]);
    return app;
  },

  update(id, payload) {
    const apps = read(APPS_KEY, []);
    const index = apps.findIndex((a) => Number(a.id) === Number(id) && a.user_id === this.currentUserId());
    if (index === -1) throw new Error("Application not found");
    apps[index] = { ...apps[index], ...payload, updated_at: new Date().toISOString() };
    write(APPS_KEY, apps);
    return apps[index];
  },

  remove(id) {
    write(
      APPS_KEY,
      read(APPS_KEY, []).filter((a) => !(Number(a.id) === Number(id) && a.user_id === this.currentUserId())),
    );
  },

  stats() {
    const apps = this.list();
    const count = (status) => apps.filter((a) => a.status.toLowerCase() === status.toLowerCase()).length;
    return {
      total: apps.length,
      applied: count("applied"),
      interview: count("interview"),
      assessment: count("assessment"),
      offer: count("offer"),
      rejected: count("rejected"),
      withdrawn: count("withdrawn"),
      recent: apps.slice(0, 5),
    };
  },

  exportCSV() {
    const apps = this.list();
    let csv = "ID,Company,Position,Location,Job Type,Status,Application Date,Interview Date,Job URL,Notes\n";
    apps.forEach((a) => {
      csv += `"${a.id}","${a.company}","${a.position}","${a.location || ""}","${a.job_type}","${a.status}","${a.application_date || ""}","${a.interview_date || ""}","${a.job_url || ""}","${(a.notes || "").replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "job_applications_export.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportCalendar() {
    const apps = this.list().filter((a) => a.status === "interview" || a.status === "assessment");
    let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//JobTrack//Demo Calendar//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";
    apps.forEach((a) => {
      const dt = a.interview_date ? new Date(a.interview_date) : new Date();
      const dtStr = dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      ics += `BEGIN:VEVENT\r\nUID:demo-${a.id}@jobtrack.com\r\nDTSTAMP:${dtStr}\r\nDTSTART:${dtStr}\r\nSUMMARY:Interview / Assessment: ${a.position} at ${a.company}\r\nDESCRIPTION:Company: ${a.company}\\nPosition: ${a.position}\\nNotes: ${a.notes || "N/A"}\r\nLOCATION:${a.location || "Remote"}\r\nSTATUS:CONFIRMED\r\nEND:VEVENT\r\n`;
    });
    ics += "END:VCALENDAR";
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "interview_schedule.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  uploadResume(id, file) {
    const apps = read(APPS_KEY, []);
    const index = apps.findIndex((a) => Number(a.id) === Number(id) && a.user_id === this.currentUserId());
    if (index === -1) throw new Error("Application not found");
    apps[index].resume_filename = file.name;
    write(APPS_KEY, apps);
    return apps[index];
  },
};

function nameFromEmail(email) {
  if (!email) return "User";
  const name = email.split("@")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}
