import type {
  Session,
  LadderRung,
  ExposureLog,
  Recommendation,
  DashboardData,
  RoutinePhase,
  Module,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  dashboard: () => request<DashboardData>("/dashboard"),

  sessions: {
    list: (limit = 100) => request<Session[]>(`/sessions?limit=${limit}`),
    create: (data: Omit<Session, "id" | "createdAt">) =>
      request<Session>("/sessions", { method: "POST", body: JSON.stringify(data) }),
  },

  ladder: {
    list: () => request<LadderRung[]>("/ladder"),
    add: (name: string) => request<LadderRung>("/ladder", { method: "POST", body: JSON.stringify({ name }) }),
    rename: (id: string, name: string) =>
      request<LadderRung>(`/ladder/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }),
    remove: (id: string) => request<void>(`/ladder/${id}`, { method: "DELETE" }),
    reorder: (orderedIds: string[]) =>
      request<LadderRung[]>("/ladder/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),
    recommendations: () => request<Recommendation[]>("/ladder/recommendations"),
  },

  exposureLogs: {
    list: (rungId?: string, limit = 200) =>
      request<ExposureLog[]>(`/exposure-logs?limit=${limit}${rungId ? `&rungId=${rungId}` : ""}`),
    create: (data: Omit<ExposureLog, "id" | "createdAt" | "difference" | "rung">) =>
      request<ExposureLog>("/exposure-logs", { method: "POST", body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/exposure-logs/${id}`, { method: "DELETE" }),
  },

  content: {
    routinePhases: () => request<RoutinePhase[]>("/content/routine-phases"),
    modules: () => request<Module[]>("/content/modules"),
    module: (num: number) => request<Module>(`/content/modules/${num}`),
    quotes: () => request<string[]>("/content/quotes"),
  },

  reflections: {
    list: () => request<{ moduleNum: number; text: string }[]>("/reflections"),
    save: (moduleNum: number, text: string) =>
      request(`/reflections/${moduleNum}`, { method: "PUT", body: JSON.stringify({ text }) }),
    complete: (moduleNum: number) => request(`/reflections/${moduleNum}/complete`, { method: "POST" }),
    completions: () => request<{ moduleNum: number; completedAt: string }[]>("/reflections/completions"),
  },
};
