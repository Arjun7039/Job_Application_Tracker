import api, { DEMO_MODE, TOKEN_KEY } from "./api";
import { demoStore } from "./demoStore";

export async function register({ name, email, password }) {
  if (DEMO_MODE) {
    const { token, user } = demoStore.register({ name, email, password });
    localStorage.setItem(TOKEN_KEY, token);
    return user;
  }
  await api.post("/auth/register", { name, email, password });
  return login({ email, password });
}

export async function login({ email, password }) {
  if (DEMO_MODE) {
    const { token, user } = demoStore.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    return user;
  }
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem(TOKEN_KEY, data.access_token);
  return getMe();
}

export async function getMe() {
  if (DEMO_MODE) return demoStore.me();
  const { data } = await api.get("/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  if (DEMO_MODE) demoStore.logout();
}
