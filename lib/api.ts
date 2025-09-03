// lib/api.ts
export async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) { let msg = ""; try { msg = await res.text(); } catch {} ; throw new Error(msg || `HTTP ${res.status}`); }
  // @ts-expect-error
  return res.json() as Promise<T>;
}
export async function apiRetry<T>(input: RequestInfo, init?: RequestInit, retries = 1): Promise<T> {
  try { return await api<T>(input, init); } catch (e) { if (retries>0) return apiRetry<T>(input, init, retries-1); throw e; }
}
