// lib/persist.ts
export type ActiveGroup = { id: string; name: string; avatar_url?: string | null; role?: string | null };
const KEY = "tangle.activeGroup.v1";
export function loadActiveGroup(): ActiveGroup | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function saveActiveGroup(g: ActiveGroup | null) {
  if (typeof window === "undefined") return;
  try { if (g) localStorage.setItem(KEY, JSON.stringify(g)); else localStorage.removeItem(KEY); } catch {}
}
