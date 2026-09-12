const rawBase = String(process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
const API = rawBase ? `${rawBase}/api` : "/api";

const parse = async (response) => {
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = {};
  }
  if (!response.ok) {
    const error = new Error(body?.detail || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
};

export const demoApi = {
  status: () => fetch(`${API}/demo/status`, { credentials: "include" }).then(parse),
  login: (password) => fetch(`${API}/demo/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  }).then(parse),
  logout: () => fetch(`${API}/demo/logout`, {
    method: "POST",
    credentials: "include",
  }).then(parse),
};
