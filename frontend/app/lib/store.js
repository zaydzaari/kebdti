// Guest profile/history and display preferences live on this device.
// Signed-in profiles and history use the backend adapter, not these guest keys.

const KEYS = {
  profile: "kebdti-profile",
  history: "kebdti-history",
  langs: "kebdti-langs",
  theme: "kebdti-theme",
};

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
};

// ---------- profile ----------
// { name, role: "grandparent" | "grandchild" | "family", lang, familyLang, voiceConsent: boolean, createdAt }
export const loadProfile = () => read(KEYS.profile, null);
export const saveProfile = (p) => write(KEYS.profile, p);

// ---------- last language pair on the Translate tab ----------
export const loadLangs = () => read(KEYS.langs, null);
export const saveLangs = (from, to) => write(KEYS.langs, { from, to });

// ---------- history ----------
const MAX_HISTORY = 50;
export const loadHistory = () => read(KEYS.history, []);
export function addHistory(entry) {
  const next = [{ id: `${Date.now()}`, at: Date.now(), ...entry }, ...loadHistory()].slice(0, MAX_HISTORY);
  write(KEYS.history, next);
  return next;
}
export function removeHistory(id) {
  const next = loadHistory().filter((h) => h.id !== id);
  write(KEYS.history, next);
  return next;
}

// ---------- theme: "system" | "light" | "dark" ----------
export function getThemePref() {
  try {
    return localStorage.getItem(KEYS.theme) || "system";
  } catch (_) {
    return "system";
  }
}
export function setThemePref(pref) {
  const root = document.documentElement;
  if (pref === "system") delete root.dataset.theme;
  else root.dataset.theme = pref;
  try {
    if (pref === "system") localStorage.removeItem(KEYS.theme);
    else localStorage.setItem(KEYS.theme, pref);
  } catch (_) {}
}
export function isDarkNow() {
  const set = document.documentElement.dataset.theme;
  return set ? set === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// ---------- wipe ----------
export function clearAll() {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (_) {}
  delete document.documentElement.dataset.theme;
}

// ---------- formatting ----------
export function timeAgo(ts) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return "Just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
