"use client";

// A grandparent's phone. They speak Darija and may not read:
//  1. "Who are you?": tap your face (grandma or grandpa), remembered on this phone.
//  2. Tap a grandchild's circle to talk with them (a dot shows new voice notes).
//  3. One big button to record. Messages arrive as big play buttons, already in Darija, and play by themselves.
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../icons";
import { LiveWaveform } from "../audio";
import { toWav16k } from "../wav";
import { backend } from "../../lib/backend";
import { getMembers, initialOf, isElder } from "../../lib/family-client";

const SEEN_KEY = "kebdti-grandma-seen";
const MAX_SECONDS = 90;
const readSeen = () => { try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]")); } catch { return new Set(); } };
const saveSeen = s => { try { localStorage.setItem(SEEN_KEY, JSON.stringify([...s].slice(-500))); } catch {} };
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
function ago(ms) {
  const m = Math.floor((Date.now() - ms) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h} h` : new Date(ms).toLocaleDateString("en-GB");
}
function familyWords() {
  try { const all = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k?.startsWith("kebdti-family-words:")) { const v = JSON.parse(localStorage.getItem(k) || "[]"); if (Array.isArray(v)) all.push(...v); } } return all.slice(0, 30); } catch { return []; }
}
const FACE = { grandmother: "👵", grandfather: "👴", grandson: "👦", granddaughter: "👧" };

export function GrandmaScreen({ profile, onFamilyView, preferRole }) {
  const [members, setMembers] = useState(null);
  const [meId, setMeId] = useState("");
  const [withId, setWithId] = useState("");
  const [choosing, setChoosing] = useState(false);
  const [all, setAll] = useState([]);
  const [offline, setOffline] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [seen, setSeen] = useState(() => new Set());
  const [phase, setPhase] = useState("idle"); // idle | recording | sending | sent | failed
  const [seconds, setSeconds] = useState(0);
  const [stream, setStream] = useState(null);
  const audioRef = useRef(null), recRef = useRef(null), chunks = useRef([]), timer = useRef(null);
  const known = useRef(null), feedRef = useRef(null), soundRef = useRef(false), withRef = useRef("");
  soundRef.current = soundOn; withRef.current = withId;

  // Each phone route remembers its own person (grandma and grandpa windows can be open side by side).
  const scope = preferRole ? `:${preferRole}` : "";
  const mem = {
    elder: () => { try { return localStorage.getItem(`kebdti-elder-me${scope}`) || ""; } catch { return ""; } },
    setElder: id => { try { localStorage.setItem(`kebdti-elder-me${scope}`, id); } catch {} },
    with: () => { try { return localStorage.getItem(`kebdti-elder-with${scope}`) || ""; } catch { return ""; } },
    setWith: id => { try { localStorage.setItem(`kebdti-elder-with${scope}`, id); } catch {} },
  };
  const me = members?.find(m => m.id === meId) || null;
  const kids = (members || []).filter(m => !isElder(m));
  const child = kids.find(k => k.id === withId) || null;

  // who is on this phone, and which grandchild they talk with
  useEffect(() => {
    setSeen(readSeen());
    getMembers().then(ms => {
      setMembers(ms);
      const elders = ms.filter(isElder);
      let mine = elders.find(e => e.id === mem.elder());
      if (!mine && profile?.role === "grandparent") mine = elders.find(e => e.name.trim().toLowerCase() === (profile.name || "").trim().toLowerCase());
      if (!mine && preferRole) mine = elders.find(e => e.role === preferRole);
      if (mine) { setMeId(mine.id); mem.setElder(mine.id); } else setChoosing(true);
      const kidsNow = ms.filter(m => !isElder(m));
      const w = kidsNow.find(k => k.id === mem.with()) || kidsNow[0];
      if (w) setWithId(w.id);
    }).catch(() => setOffline(true));
  }, [profile?.name, profile?.role, preferRole]);

  const play = useCallback(item => {
    if (!item?.audioUrl) return;
    const a = audioRef.current || (audioRef.current = new Audio());
    if (playing === item.id && !a.paused) { a.pause(); setPlaying(null); return; }
    a.src = item.audioUrl; a.currentTime = 0;
    a.onended = () => setPlaying(null);
    a.play().then(() => setPlaying(item.id)).catch(() => setPlaying(null));
    setSeen(prev => { const next = new Set(prev); next.add(item.id); saveSeen(next); return next; });
  }, [playing]);

  // live messages, shared by every phone
  useEffect(() => {
    if (!meId) return;
    let stop = false;
    async function load() {
      try {
        const r = await fetch("/api/family", { cache: "no-store" }).then(r => r.json());
        if (stop) return;
        setOffline(!r.ok);
        const mine = (r.items || []).filter(m => m.fromId === meId || m.toId === meId);
        if (known.current) {
          const fresh = mine.filter(m => m.direction === "from_grandchild" && m.toId === meId && !known.current.has(m.id));
          const forOpen = fresh.filter(m => m.fromId === withRef.current);
          if (forOpen.length && soundRef.current) setTimeout(() => play(forOpen[forOpen.length - 1]), 300);
        }
        known.current = new Set(mine.map(m => m.id));
        setAll(mine);
      } catch { if (!stop) setOffline(true); }
    }
    load();
    const t = setInterval(load, 3000);
    return () => { stop = true; clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meId]);

  const feed = all.filter(m => (m.fromId === withId && m.toId === meId) || (m.fromId === meId && m.toId === withId && m.source !== "translate")).slice(-25);
  const unread = id => all.some(m => m.direction === "from_grandchild" && m.fromId === id && m.toId === meId && !seen.has(m.id));

  useEffect(() => { feedRef.current?.scrollTo({ top: 1e9, behavior: "smooth" }); }, [feed.length, withId]);
  useEffect(() => () => { clearInterval(timer.current); audioRef.current?.pause(); recRef.current?.stream?.getTracks().forEach(t => t.stop()); }, []);

  function pickChild(id) { setWithId(id); mem.setWith(id); audioRef.current?.pause(); setPlaying(null); }
  function pickMe(id) { setMeId(id); mem.setElder(id); setChoosing(false); known.current = null; }

  async function startRecording() {
    if (!child) return;
    audioRef.current?.pause(); setPlaying(null);
    let s;
    try { s = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { setPhase("failed"); setTimeout(() => setPhase(p => (p === "failed" ? "idle" : p)), 3500); return; }
    const mr = new MediaRecorder(s); recRef.current = mr; chunks.current = [];
    mr.ondataavailable = e => e.data.size && chunks.current.push(e.data);
    mr.onstop = () => { s.getTracks().forEach(t => t.stop()); setStream(null); clearInterval(timer.current); send(new Blob(chunks.current, { type: mr.mimeType || "audio/webm" })); };
    mr.start(); setStream(s); setSeconds(0); setPhase("recording");
    const t0 = Date.now();
    timer.current = setInterval(() => { const sec = Math.floor((Date.now() - t0) / 1000); setSeconds(sec); if (sec >= MAX_SECONDS) mr.stop(); }, 250);
  }

  async function send(blob) {
    if (blob.size < 2000 || !child || !me) { setPhase("idle"); return; }
    setPhase("sending");
    try {
      let upload = blob, name = "note.webm";
      try { upload = await toWav16k(blob); name = "note.wav"; } catch {}
      const fd = new FormData();
      fd.append("from", "dar"); fd.append("to", child.lang || "en"); fd.append("source", "grandma");
      fd.append("from_id", me.id); fd.append("to_id", child.id);
      fd.append("family", JSON.stringify(familyWords()));
      fd.append("audio", upload, name);
      const data = await backend.translate(fd);
      if (!data.ok || data.unclear) throw new Error("unclear");
      setPhase("sent");
      setTimeout(() => setPhase(p => (p === "sent" ? "idle" : p)), 2500);
    } catch { setPhase("failed"); setTimeout(() => setPhase(p => (p === "failed" ? "idle" : p)), 3500); }
  }

  const recording = phase === "recording", busy = phase === "sending";

  // ---------- "Who are you?"
  if (choosing || (!me && members)) {
    const elders = (members || []).filter(isElder);
    return (
      <div className="grandma" lang="ar">
        <header className="gm-top"><img src="/brand/kebdti-mark.svg" width="36" height="36" alt="" /><span className="gm-title-pair"><span className="gm-title" dir="rtl">شكون نتا / نتي؟</span><small className="gm-en">Who is using this phone?</small></span></header>
        <div className="gm-who">
          {elders.map(e => (
            <button key={e.id} type="button" className={`gm-who-card ${e.role}`} onClick={() => pickMe(e.id)} aria-label={e.name}>
              <span className="gm-who-face" aria-hidden="true">{FACE[e.role]}</span>
              <span className="gm-who-name">{e.name}</span>
            </button>
          ))}
          {!elders.length && <p className="gm-offline"><Icon name="alert" size={22} /><span dir="rtl">ما كاينش الاتصال</span><small className="gm-en">No connection</small></p>}
        </div>
      </div>
    );
  }

  return (
    <div className="grandma" lang="ar">
      <AnimatePresence>
        {!soundOn && me && (
          <motion.button key="gate" className="gm-gate" onClick={() => setSoundOn(true)} aria-label="Start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="gm-gate-btn"><Icon name="play" size={64} filled /></span>
            <span className="gm-gate-word" dir="rtl">{me.name}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <header className="gm-top">
        <button className="gm-me" onClick={() => setChoosing(true)} aria-label="Who is using this phone">
          <span className={`member-av ${me?.role}`}>{FACE[me?.role] || initialOf(me)}</span>
          <span className="gm-title" dir="rtl">{me?.name || "كبدتي"}</span>
        </button>
        {onFamilyView && <button className="gm-switch" onClick={onFamilyView} aria-label="Family view"><Icon name="user" size={20} /></button>}
      </header>

      <nav className="gm-kids" aria-label="Grandchildren">
        {kids.map(k => (
          <button key={k.id} type="button" className={`gm-kid${k.id === withId ? " is-on" : ""}`} onClick={() => pickChild(k.id)} aria-label={k.name} aria-pressed={k.id === withId}>
            <span className={`gm-kid-av ${k.role}`} aria-hidden="true">{FACE[k.role]}{unread(k.id) && k.id !== withId && <i className="gm-dot" />}</span>
            <span className="gm-kid-name">{k.name}</span>
          </button>
        ))}
      </nav>

      <ol className="gm-feed" ref={feedRef} aria-label="Messages">
        {offline && <li className="gm-offline" role="status"><Icon name="alert" size={22} /><span dir="rtl">ما كاينش الاتصال</span><small className="gm-en">No connection</small></li>}
        {!offline && !feed.length && <li className="gm-empty" aria-hidden="true"><img src="/illustrations/letter.svg" width="140" alt="" /></li>}
        {feed.map(m => m.direction === "from_grandchild" ? (
          <li key={m.id} className={`gm-msg${seen.has(m.id) ? "" : " is-new"}`}>
            <button className={`gm-play${playing === m.id ? " is-playing" : ""}`} onClick={() => play(m)} disabled={!m.audioUrl} aria-label={playing === m.id ? "Pause" : "Play"}>
              <Icon name={playing === m.id ? "pause" : "play"} size={34} filled />
            </button>
            <div className="gm-body">
              <p dir="rtl">{m.text}</p>
              {m.original && <small className="gm-en gm-said" dir="auto">{child?.name || "They"} said: “{m.original}”</small>}
              <span className="gm-time">{ago(m.at)}</span>
            </div>
          </li>
        ) : (
          <li key={m.id} className="gm-msg is-mine">
            <div className="gm-body">
              <p dir="rtl" className="gm-mine-text">{m.original}</p>
              {m.text && <small className="gm-en gm-said" dir="auto">Sent as: “{m.text}”</small>}
              <span className="gm-time"><Icon name="check" size={15} /> {ago(m.at)}</span>
            </div>
          </li>
        ))}
      </ol>

      <footer className="gm-dock">
        <div className="gm-status" role="status" aria-live="polite">
          {recording && <><span className="rec-dot" /><span className="tnum">{fmt(seconds)}</span></>}
          {busy && <span className="gm-spinner" aria-label="Sending" />}
          {phase === "sent" && <span className="gm-ok"><Icon name="check" size={30} strokeWidth={2.4} /></span>}
          {phase === "failed" && <span className="gm-fail"><Icon name="replay" size={28} /></span>}
        </div>
        {recording && <div className="gm-wave"><LiveWaveform stream={stream} bars={28} /></div>}
        <button className={`gm-mic${recording ? " is-recording" : ""}`} disabled={busy || !child}
                onClick={recording ? () => recRef.current?.stop() : startRecording}
                aria-label={recording ? "Send" : `Record a voice note for ${child?.name || ""}`}>
          {recording ? <span className="gm-stop" /> : <Icon name="mic" size={56} strokeWidth={2} />}
        </button>
      </footer>
    </div>
  );
}
