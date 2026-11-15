// Family members on the client: who is on this phone, and who they are talking with.
import { LIVE_CODES } from "./languages";

export const isElder = m => m?.role === "grandmother" || m?.role === "grandfather";
export const RELATION = { grandmother: "Grandma", grandfather: "Grandpa", grandson: "Grandson", granddaughter: "Granddaughter" };
export const relationOf = m => RELATION[m?.role] || "Family";
export const initialOf = m => (m?.name || "?").trim().replace(/^(mi|sidi|lalla|jeddi|hajja?)\s+/i, "").charAt(0).toUpperCase();

const read = k => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
const write = (k, v) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch {} };
export const store = {
  me: () => read("kebdti-me"), setMe: id => write("kebdti-me", id),                         // grandchild on this phone
  with: () => read("kebdti-with"), setWith: id => write("kebdti-with", id),                 // relative they talk with
  elder: () => read("kebdti-elder-me"), setElder: id => write("kebdti-elder-me", id),       // grandparent on this phone
  elderWith: () => read("kebdti-elder-with"), setElderWith: id => write("kebdti-elder-with", id),
};

async function call(url, init) {
  const res = await fetch(url, { cache: "no-store", ...init });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "That didn't go through. Try again.");
  return data;
}
export const getMembers = async () => (await call("/api/family/members")).members || [];
export const saveMember = m => call("/api/family/members", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(m) });
export const removeMember = id => call(`/api/family/members?id=${encodeURIComponent(id)}`, { method: "DELETE" });

// The grandchild using this app: the saved member, or one matching the profile name, or a new one.
export async function ensureMe(profile) {
  let members = await getMembers();
  let me = members.find(m => m.id === store.me() && !isElder(m));
  if (!me) me = members.find(m => !isElder(m) && m.name.trim().toLowerCase() === (profile?.name || "").trim().toLowerCase());
  if (!me) {
    const lang = LIVE_CODES.includes(profile?.lang) && profile.lang !== "dar" ? profile.lang : LIVE_CODES.includes(profile?.familyLang) && profile.familyLang !== "dar" ? profile.familyLang : "en";
    const r = await saveMember({ name: profile?.name || "Me", role: "grandson", lang });
    me = r.member; members = r.members;
  }
  store.setMe(me.id);
  return { me, members };
}
