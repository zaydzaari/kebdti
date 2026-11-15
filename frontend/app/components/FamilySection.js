"use client";

// Profile → Your family: everyone in the family, who this phone belongs to, add or remove a relative.
import { Fragment, useEffect, useState } from "react";
import { Icon } from "./icons";
import { Alert, Button } from "./ui";
import { VoiceSetup } from "./VoiceSetup";
import { LANG } from "../lib/languages";
import { getMembers, initialOf, isElder, relationOf, removeMember, saveMember, store } from "../lib/family-client";

const ROLES = [["grandmother", "Grandma"], ["grandfather", "Grandpa"], ["grandson", "Grandson"], ["granddaughter", "Granddaughter"]];
const KID_LANGS = ["en", "fr", "es", "it", "nl", "de", "ar"];

export function FamilySection({ onToast }) {
  const [members, setMembers] = useState(null);
  const [me, setMe] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", role: "grandson", lang: "en" });
  const [busy, setBusy] = useState(false);
  const [voiceFor, setVoiceFor] = useState("");

  useEffect(() => {
    setMe(store.me());
    getMembers().then(setMembers).catch(e => setError(e.message));
  }, []);

  async function run(fn, done) {
    if (busy) return;
    setBusy(true); setError("");
    try { await fn(); done && onToast?.(done); } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  const add = () => run(async () => {
    if (!draft.name.trim()) throw new Error("Write their name.");
    const r = await saveMember({ name: draft.name.trim(), role: draft.role, lang: draft.lang });
    setMembers(r.members); setAdding(false); setDraft({ name: "", role: "grandson", lang: "en" });
  }, "Added to your family");
  const remove = m => run(async () => {
    const r = await removeMember(m.id); setMembers(r.members);
    if (store.me() === m.id) { store.setMe(""); setMe(""); }
  }, `${m.name} removed`);
  const setRole = (m, role) => run(async () => { const r = await saveMember({ ...m, role }); setMembers(r.members); }, "Saved");
  const setCall = (m, address) => run(async () => { const r = await saveMember({ ...m, address }); setMembers(r.members); }, "Saved");
  const setLang = (m, lang) => run(async () => { const r = await saveMember({ ...m, lang }); setMembers(r.members); }, "Saved");
  const chooseMe = m => { store.setMe(m.id); setMe(m.id); onToast?.(`This phone is ${m.name}'s`); };

  return (
    <section className="k-group k-family-section">
      <h2 className="k-group-title">Your family</h2>
      <div className="k-group-box">
        {!members && !error && <div className="k-row"><span className="k-row-sub">Loading your family…</span></div>}
        {members?.map(m => (
          <Fragment key={m.id}>
          <div className="k-row member-row">
            <span className={`member-av ${m.role}`}>{initialOf(m)}</span>
            <span className="k-row-main">
              <span className="k-row-label">{m.name}{m.id === me && <span className="me-tag">This phone</span>}</span>
              <span className="k-row-sub">
                {isElder(m) ? <>
                  {relationOf(m)}, speaks Darija ·{" "}
                  <label className="member-call">
                    <span>{m.role === "grandfather" ? "We call him" : "We call her"}</span>
                    <input key={`${m.id}:${m.address || ""}`} dir="rtl" lang="ar" defaultValue={m.address || ""} maxLength={20} disabled={busy}
                      list={`call-${m.role}`} aria-label={`What the family calls ${m.name}`}
                      onBlur={e => { const v = e.target.value.trim(); if (v && v !== m.address) setCall(m, v); }}
                      onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }} />
                  </label>
                </> : <>
                  <select aria-label={`${m.name} is a`} value={m.role} onChange={e => setRole(m, e.target.value)} disabled={busy}>
                    <option value="grandson">Grandson</option><option value="granddaughter">Granddaughter</option>
                  </select>
                  <select aria-label={`${m.name} speaks`} value={m.lang} onChange={e => setLang(m, e.target.value)} disabled={busy}>
                    {KID_LANGS.map(l => <option key={l} value={l}>{LANG[l]?.label || l}</option>)}
                  </select>
                </>}
              </span>
            </span>
            {!isElder(m) && m.id !== me && <button type="button" className="member-btn" onClick={() => chooseMe(m)} disabled={busy}>This is me</button>}
            {m.voice === "grandma-clone"
              ? <span className="member-voice-tag" title="Learned from her own voice notes, with her consent"><Icon name="check" size={14} /> Her voice</span>
              : <button type="button" className={`member-btn${voiceFor === m.id ? " is-on" : ""}`} aria-expanded={voiceFor === m.id} onClick={() => setVoiceFor(voiceFor === m.id ? "" : m.id)} disabled={busy}><Icon name="mic" size={15} /> Voice</button>}
            <button type="button" className="member-remove" aria-label={`Remove ${m.name}`} onClick={() => remove(m)} disabled={busy}><Icon name="trash" size={17} /></button>
          </div>
          {voiceFor === m.id && <div className="member-voice"><VoiceSetup memberId={m.id} name={m.name} lang={isElder(m) ? "dar" : m.lang || "en"} self={m.id === me} onToast={onToast} /></div>}
          </Fragment>
        ))}
        {adding ? (
          <form className="member-form" onSubmit={e => { e.preventDefault(); add(); }}>
            <input aria-label="Name" placeholder="Their name" value={draft.name} maxLength={40} onChange={e => setDraft({ ...draft, name: e.target.value })} autoFocus />
            <select aria-label="Relation" value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value })}>
              {ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            {!["grandmother", "grandfather"].includes(draft.role) && (
              <select aria-label="Language" value={draft.lang} onChange={e => setDraft({ ...draft, lang: e.target.value })}>
                {KID_LANGS.map(l => <option key={l} value={l}>{LANG[l]?.label || l}</option>)}
              </select>
            )}
            <div className="member-form-actions">
              <Button type="submit" disabled={busy}>Add</Button>
              <Button variant="ghost" onClick={() => setAdding(false)} disabled={busy}>Cancel</Button>
            </div>
          </form>
        ) : members && (
          <button type="button" className="k-row k-row-btn member-add" onClick={() => setAdding(true)}>
            <span className="k-row-icon"><Icon name="user" size={17} /></span>
            <span className="k-row-main"><span className="k-row-label">Add a relative</span><span className="k-row-sub">Grandma, grandpa, grandson or granddaughter</span></span>
          </button>
        )}
      </div>
      {error && <Alert>{error}</Alert>}
      <datalist id="call-grandmother">{["أ جدة", "أ جدتي", "أ ميمة", "أ حنا", "أ لالة", "أ مي"].map(w => <option key={w} value={w} />)}</datalist>
      <datalist id="call-grandfather">{["أ جدي", "أ سيدي", "أ بابا الحاج", "أ بابا", "أ جدو"].map(w => <option key={w} value={w} />)}</datalist>
    </section>
  );
}
