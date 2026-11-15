"use client";

// "Your own voice": talk for 15 to 30 seconds once, and every message after that is spoken in your voice.
// The recording is kept privately on Kebdti's server (data/audio/voices/<member>) and can be removed any time.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";
import { Alert, Button, swapIn } from "./ui";
import { LiveWaveform, fmt } from "./audio";

const MIN = 15, MAX = 30;

// Something easy to read out loud, in the language the person speaks. Any speech works; this just helps people start.
const READ_ME = {
  fr: "Coucou mamie, c'est moi ! J'enregistre ma voix pour que tu m'entendes vraiment, même de loin. Ici tout va bien, l'école se passe bien, et je pense souvent à toi. J'ai hâte de revenir manger ton couscous du vendredi et de t'écouter raconter tes histoires.",
  es: "¡Hola abuela, soy yo! Grabo mi voz para que me escuches de verdad, aunque esté lejos. Aquí todo va bien, el colegio va bien y pienso mucho en ti. Tengo muchas ganas de volver, comer tu cuscús del viernes y escuchar tus historias.",
  it: "Ciao nonna, sono io! Registro la mia voce così mi senti davvero, anche da lontano. Qui va tutto bene, la scuola va bene e ti penso spesso. Non vedo l'ora di tornare, mangiare il tuo cuscus del venerdì e ascoltare le tue storie.",
  en: "Hi grandma, it's me! I'm recording my voice so you can really hear me, even from far away. Everything is fine here, school is going well, and I think about you a lot. I can't wait to come back, eat your Friday couscous and listen to your stories.",
  nl: "Hoi oma, ik ben het! Ik neem mijn stem op zodat je me echt kunt horen, ook van ver weg. Alles gaat goed hier, school gaat prima en ik denk vaak aan je. Ik kan niet wachten om terug te komen, je couscous van vrijdag te eten en naar je verhalen te luisteren.",
  de: "Hallo Oma, ich bin's! Ich nehme meine Stimme auf, damit du mich wirklich hörst, auch von weit weg. Hier ist alles gut, die Schule läuft gut und ich denke oft an dich. Ich kann es kaum erwarten, zurückzukommen, deinen Freitags-Couscous zu essen und deinen Geschichten zuzuhören.",
  ar: "مرحبا يا جدتي، هذا أنا! أسجل صوتي لكي تسمعيني حقا، حتى من بعيد. كل شيء بخير هنا، والدراسة تسير جيدا، وأفكر فيك كثيرا. أنتظر بفارغ الصبر أن أعود لآكل كسكس الجمعة وأستمع إلى حكاياتك.",
  dar: "السلام عليكم أوليداتي. هادا صوتي باش تسمعوني ديما. الحمد لله أنا بخير والدار بخير. توحشتكم بزاف وكندعي معاكم كل نهار. الله يحفظكم ويرضي عليكم، وما تنساوش تعيطو عليا.",
};

const ago = at => {
  if (!at) return "";
  const d = Math.round((Date.now() / 1000 - at) / 86400);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d} days ago`;
};

export function VoiceSetup({ memberId, name, lang = "en", self = true, active = true, onReady, onStatus, onToast }) {
  const [status, setStatus] = useState(null);          // { ready, seconds, at } | null while loading
  const [phase, setPhase] = useState("idle");          // idle | recording | uploading
  const [seconds, setSeconds] = useState(0);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState("");
  const recRef = useRef(null), chunks = useRef([]), timer = useRef(null), cancelled = useRef(false), alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    if (!memberId) return;
    setStatus(null);
    fetch(`/api/myvoice/${memberId}`, { cache: "no-store" }).then(r => r.json()).then(d => alive.current && setStatus(d.ready !== undefined ? d : { ready: false })).catch(() => alive.current && setStatus({ ready: false }));
    return () => { alive.current = false; };
  }, [memberId]);

  useEffect(() => { if (status) onStatus?.(!!status.ready); }, [status]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { clearInterval(timer.current); cancelled.current = true; const r = recRef.current; if (r && r.state !== "inactive") r.stop(); r?.stream?.getTracks().forEach(t => t.stop()); }, []);
  useEffect(() => { if (phase === "recording" && seconds >= MAX) stop(); }, [seconds, phase]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!active && recRef.current?.state === "recording") cancel(); }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  async function start() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setError("This browser can't record. Open Kebdti in Chrome, Safari or Firefox."); return; }
    let s, mr;
    try { s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
    catch { setError("Kebdti needs your microphone. Allow mic access in your browser, then try again."); return; }
    try { mr = new MediaRecorder(s); } catch { s.getTracks().forEach(t => t.stop()); setError("This browser can't record. Open Kebdti in Chrome, Safari or Firefox."); return; }
    recRef.current = mr; chunks.current = []; cancelled.current = false;
    mr.ondataavailable = e => e.data.size && chunks.current.push(e.data);
    mr.onstop = () => {
      s.getTracks().forEach(t => t.stop()); setStream(null);
      if (cancelled.current) { setPhase("idle"); return; }
      upload(new Blob(chunks.current, { type: mr.mimeType || "audio/webm" }));
    };
    mr.start(); setStream(s); setSeconds(0); setPhase("recording");
    timer.current = setInterval(() => setSeconds(x => x + 1), 1000);
  }
  function stop() { clearInterval(timer.current); const r = recRef.current; if (r && r.state !== "inactive") r.stop(); }
  function cancel() { cancelled.current = true; stop(); }

  async function upload(blob) {
    setPhase("uploading");
    try {
      const fd = new FormData();
      fd.append("audio", blob, (blob.type || "").includes("ogg") ? "voice.ogg" : (blob.type || "").includes("mp4") ? "voice.m4a" : "voice.webm");
      const res = await fetch(`/api/myvoice/${memberId}`, { method: "POST", body: fd });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ready) throw new Error(d.message || "That didn't work. Try again.");
      if (!alive.current) return;
      setStatus({ ready: true, seconds: d.seconds, at: Math.floor(Date.now() / 1000) });
      onReady?.(d); onToast?.(self ? "Your voice is ready" : `${name}'s voice is ready`);
    } catch (e) { alive.current && setError(e.message); }
    finally { alive.current && setPhase("idle"); }
  }

  async function forget() {
    setError("");
    try {
      await fetch(`/api/myvoice/${memberId}`, { method: "DELETE" });
      setStatus({ ready: false }); onToast?.(self ? "Your voice was removed" : `${name}'s voice was removed`);
    } catch { setError("That didn't go through. Try again."); }
  }

  if (!memberId) return null;
  const ready = !!status?.ready, recording = phase === "recording", uploading = phase === "uploading";
  const enough = seconds >= MIN, left = Math.max(0, MIN - seconds);
  const who = self ? "you" : name;
  const text = READ_ME[lang] || READ_ME.en;
  const textMeaning = lang === "dar" ? "Peace be upon you, my children. This is my voice so you can always hear me. Thank God I am well and the house is well. I miss you so much and I pray for you every day. May God protect you, and don't forget to call me." : "";

  return (
    <section className={`voice-setup${ready ? " is-ready" : ""}`} aria-label={self ? "Your own voice" : `${name}'s voice`}>
      <div className="vs-head">
        <span className="vs-icon"><Icon name={ready ? "check" : "mic"} size={20} strokeWidth={2} /></span>
        <div className="vs-titles">
          <h3>{self ? "Your own voice" : `${name}'s own voice`}</h3>
          <p>{!status ? "Checking…" : ready ? `Ready · learned from ${Math.round(status.seconds || 0)} s${status.at ? `, ${ago(status.at)}` : ""}. Every message is spoken in ${self ? "your" : "their"} voice.`
            : `Talk for ${MIN} to ${MAX} seconds once, and the family hears ${who === "you" ? "you" : who} in ${self ? "your" : "their"} real voice, not a robot.`}</p>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {recording ? (
          <motion.div key="rec" className="vs-rec" {...swapIn}>
            <p className="vs-read" dir="auto" lang={lang === "dar" ? "ar" : lang}>{text}</p>
            {textMeaning && <p className="vs-meaning">{textMeaning}</p>}
            <LiveWaveform stream={stream} />
            <div className="vs-meter" role="progressbar" aria-valuemin={0} aria-valuemax={MAX} aria-valuenow={seconds} aria-label="Recording length">
              <span className="vs-fill" style={{ width: `${Math.min(100, (seconds / MAX) * 100)}%` }} data-enough={enough} />
              <span className="vs-mark" style={{ left: `${(MIN / MAX) * 100}%` }} />
            </div>
            <div className="vs-row">
              <span className="timer tnum"><span className="rec-dot" /> {fmt(seconds)} <span className="timer-max">/ {fmt(MAX)}</span></span>
              <span className="vs-hint" role="status">{enough ? (seconds >= MAX - 5 ? "Almost done…" : "Great. Tap Done whenever you like.") : `Keep talking, ${left} more second${left === 1 ? "" : "s"}`}</span>
            </div>
            <div className="vs-actions">
              <Button icon="check" onClick={stop} disabled={!enough}>Done</Button>
              <Button variant="ghost" onClick={cancel}>Cancel</Button>
            </div>
          </motion.div>
        ) : uploading ? (
          <motion.div key="up" className="vs-rec" {...swapIn}>
            <p className="vs-hint" role="status"><span className="vs-spin" aria-hidden="true" /> Learning {self ? "your" : `${name}'s`} voice…</p>
          </motion.div>
        ) : status && (
          <motion.div key="idle" className="vs-actions" {...swapIn}>
            {ready ? <>
              <Button variant="secondary" icon="rotate" onClick={start}>Record again</Button>
              <Button variant="ghost" icon="trash" onClick={forget}>Remove</Button>
            </> : <Button icon="mic" onClick={start}>Record {self ? "my" : `${name}'s`} voice · {MIN}–{MAX} s</Button>}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{error && <Alert key="err">{error}</Alert>}</AnimatePresence>
      <p className="fine-print"><Icon name="shield" size={13} /> Recording this is {self ? "your" : "their"} yes. It is kept privately for this family and can be removed any time.</p>
    </section>
  );
}
