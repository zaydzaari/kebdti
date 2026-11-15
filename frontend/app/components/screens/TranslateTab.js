"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Flag } from "../flags";
import { Icon } from "../icons";
import { Alert, Avatar, Button, LanguageSheet, LanguageSwitch, Switch, ThemeToggle, fadeUp, stagger, swapIn } from "../ui";
import { VoiceSetup } from "../VoiceSetup";
import { FamilyInbox } from "../FamilyInbox";
import { TalkingWith } from "../TalkingWith";
import { ensureMe, isElder, store as familyStore } from "../../lib/family-client";
import { AudioPill, LiveWaveform, RecordButton, TranslateSteps, fmt } from "../audio";
import { toWav16k } from "../wav";
import { backend, LIVE_TRANSLATE, SAMPLE_MODE } from "../../lib/backend";
import { LANG, LIVE_CODES, safePair } from "../../lib/languages";
import { loadLangs, saveLangs } from "../../lib/store";
import { buildShareText, checkReceivedFile, pickRecordingMime, recordingFileName, whatsappUrl } from "../../lib/share";

const MAX_SECONDS = 60;
const stripEmoji = (s = "") => s.replace(/\p{Extended_Pictographic}|️/gu, "").trim();
const shorten = (s = "", max = 30) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);
// Family expressions saved on this device (Between us), sent to the translator as the family's own glossary.
function familyWords() { try { const all = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith("kebdti-family-words:")) { const v = JSON.parse(localStorage.getItem(k) || "[]"); if (Array.isArray(v)) all.push(...v); } } return all.slice(0, 30); } catch { return []; } }
const prefersReducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function TranslateTab({ profile, demo, active=true, conversationPrompt, onStartConversation, onGoPhrases, testScenario = "success", onSaved, onToast }) {
  const [from, setFrom] = useState(profile.lang || "dar");
  const [to, setTo] = useState(profile.familyLang || "en");
  const [picking, setPicking] = useState(null); // "from" | "to" | null
  const [phase, setPhase] = useState("idle"); // idle | recording | recorded | translating | done
  const [seconds, setSeconds] = useState(0);
  const [origUrl, setOrigUrl] = useState(null);
  const [stream, setStream] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [micPending,setMicPending]=useState(false);
  const [source, setSource] = useState("mine"); // "mine" = I recorded it · "received" = a note someone sent me
  const [fileName, setFileName] = useState("");
  const [replyTo, setReplyTo] = useState(null); // { text } the note being answered
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [typed, setTyped] = useState("");
  const [typedSent, setTypedSent] = useState(false);
  // The family: who this grandchild is, and which grandparent they are talking with.
  const [family, setFamily] = useState({ me: null, members: [] });
  const [withId, setWithId] = useState("");
  // Auto-detect: just talk, Kebdti works out whether it is Darija, English, French, Spanish or Italian.
  const [auto, setAutoState] = useState(true);
  useEffect(() => { try { if (localStorage.getItem("kebdti-auto") === "0") setAutoState(false); } catch {} }, []);
  function setAuto(v) { setAutoState(v); try { localStorage.setItem("kebdti-auto", v ? "1" : "0"); } catch {} reset(); }
  const [voiceReady, setVoiceReady] = useState(null);
  const live = LIVE_TRANSLATE && !demo;
  const autoOn = live && auto;
  useEffect(() => {
    if (!live) return;
    let alive = true;
    ensureMe(profile).then((f) => { if (!alive) return; setFamily(f); const elders = f.members.filter(isElder); const saved = familyStore.with(); setWithId(elders.some((e) => e.id === saved) ? saved : (elders[0]?.id || "")); }).catch(() => {});
    return () => { alive = false; };
  }, [profile.name, live]); // eslint-disable-line react-hooks/exhaustive-deps
  const withMember = family.members.find((m) => m.id === withId) || null;
  function pickWith(id) { setWithId(id); familyStore.setWith(id); }
  useEffect(() => setMounted(true), []);
  const copiedTimer = useRef(null);

  const recRef = useRef(null);
  const blobRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const cancelledRef = useRef(false);
  const firstProfile = useRef(true);
  const requestRef=useRef(null), requestVersion=useRef(0);
  const captureVersion=useRef(0),pendingCapture=useRef(null),activeRef=useRef(active);
  const fileInputRef = useRef(null);
  const workspaceRef = useRef(null);
  const resultHeadRef = useRef(null), focusedResult = useRef(null);
  const ownPair = useRef(null); // the pair to return to after a received note
  activeRef.current=active;
  useEffect(()=>()=>{captureVersion.current++;cancelledRef.current=true;requestVersion.current++;requestRef.current?.abort();clearInterval(timerRef.current);const recorder=recRef.current;if(recorder&&recorder.state!=="inactive")recorder.stop();recorder?.stream?.getTracks().forEach(track=>track.stop());window.speechSynthesis?.cancel();},[]);
  useEffect(()=>()=>{if(origUrl)URL.revokeObjectURL(origUrl);},[origUrl]);
  useEffect(()=>{if(!active){captureVersion.current++;if(recRef.current?.state==='recording')cancelRecording();window.speechSynthesis?.cancel();}},[active]);
  useEffect(()=>{if(conversationPrompt?.requestId)reset();},[conversationPrompt?.requestId]);

  const busy = phase === "recording" || phase === "translating";
  const src = LANG[from];
  const tgt = LANG[to];
  const received = source === "received";

  // Start from the last pair used on this phone, else the profile's languages.
  useEffect(() => {
    if (demo) {
      setFrom("dar");
      setTo("fr");
      setSeconds(12);
      translate("dar", "fr");
      return;
    }
    const saved = loadLangs();
    if (saved && LANG[saved.from] && LANG[saved.to] && saved.from !== saved.to) {
      setFrom(saved.from);
      setTo(saved.to);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When languages change in Profile, follow them.
  useEffect(() => {
    if (firstProfile.current) {
      firstProfile.current = false;
      return;
    }
    setFrom(profile.lang);
    setTo(profile.familyLang);
  }, [profile.lang, profile.familyLang]);

  // Remember the pair for my own notes. A received note flips it only for that note.
  useEffect(() => {
    if (!demo && !received) saveLangs(from, to);
  }, [from, to, demo, received]);

  useEffect(() => {
    if (phase === "recording" && seconds >= MAX_SECONDS) stopRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, phase]);

  // Bring a new result into view and move focus to it, so nobody has to hunt for it.
  function showResult(node) {
    if (!node || !activeRef.current || !result || focusedResult.current === result) return;
    focusedResult.current = result;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  const resultHead = (node) => { resultHeadRef.current = node; showResult(node); };
  useEffect(() => { if (active) showResult(resultHeadRef.current); }, [active, result]); // eslint-disable-line react-hooks/exhaustive-deps

  function reset() {
    requestVersion.current++;requestRef.current?.abort();
    clearInterval(timerRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (origUrl) URL.revokeObjectURL(origUrl);
    blobRef.current = null;
    focusedResult.current = null;
    setOrigUrl(null);
    setResult(null);
    setError("");
    setSeconds(0);
    setSource("mine");
    setFileName("");
    setReplyTo(null);
    setPhase("idle");
  }

  // Leave a received note and go back to recording my own, in my usual direction.
  function newNote() {
    const pair = ownPair.current;
    ownPair.current = null;
    reset();
    if (pair) { setFrom(pair.from); setTo(pair.to); }
  }

  function swap() {
    ownPair.current = null;
    reset();
    setFrom(to);
    setTo(from);
  }

  const closePicker = useCallback(() => setPicking(null), []);
  function pickLanguage(code) {
    const side = picking;
    setPicking(null);
    if (side === "from" && code !== from) {
      ownPair.current = null;
      reset();
      const p = safePair(code, code === to ? from : to);
      setFrom(p.from); setTo(p.to);
    } else if (side === "to" && code !== to) {
      ownPair.current = null;
      reset();
      const p = safePair(code === from ? to : from, code);
      setFrom(p.from); setTo(p.to);
    }
  }

  async function startRecording() {
    if(pendingCapture.current!==null)return;
    const version=++captureVersion.current;pendingCapture.current=version;setMicPending(true);
    let acquired;
    setError("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      acquired=s;
      if(!activeRef.current||captureVersion.current!==version){s.getTracks().forEach(track=>track.stop());return;}
      // Prefer a format WhatsApp accepts (.m4a) when this browser can record it.
      const mimeType = typeof MediaRecorder.isTypeSupported === "function" ? pickRecordingMime((type) => MediaRecorder.isTypeSupported(type)) : "";
      const mr = mimeType ? new MediaRecorder(s, { mimeType }) : new MediaRecorder(s);
      chunksRef.current = [];
      cancelledRef.current = false;
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        s.getTracks().forEach((t) => t.stop());
        setStream(null);
        if (cancelledRef.current) return;
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        blobRef.current = blob;
        setOrigUrl(URL.createObjectURL(blob));
        setPhase("recorded");
      };
      recRef.current = mr;
      mr.start();
      setStream(s);
      setSeconds(0);
      setPhase("recording");
      timerRef.current = setInterval(() => setSeconds((x) => x + 1), 1000);
    } catch (_) {
      acquired?.getTracks().forEach(track=>track.stop());
      if(activeRef.current&&captureVersion.current===version){setError("Kebdti needs your microphone. Allow mic access in your browser, then try again.");setPhase("idle");}
    }finally{if(pendingCapture.current===version){pendingCapture.current=null;setMicPending(false);}}
  }

  function stopRecording() {
    clearInterval(timerRef.current);
    const mr = recRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
  }

  function cancelRecording() {
    cancelledRef.current = true;
    stopRecording();
    reset();
  }

  // Open a voice note someone sent (for example saved from WhatsApp) to see what it means.
  function openReceived(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // so the same file can be chosen again
    if (!file) return;
    const problem = checkReceivedFile(file);
    if (problem) { setError(problem); return; }
    if (!ownPair.current) ownPair.current = { from, to };
    reset();
    const url = URL.createObjectURL(file);
    blobRef.current = file;
    setOrigUrl(url);
    setFileName(file.name || "Voice note");
    setSource("received");
    // The note is in the family's language; read it in mine.
    setFrom(profile.familyLang);
    setTo(profile.lang);
    setPhase("recorded");
    try {
      const probe = new Audio();
      probe.preload = "metadata";
      probe.onloadedmetadata = () => {
        if (blobRef.current === file && Number.isFinite(probe.duration)) setSeconds(Math.round(probe.duration));
      };
      probe.src = url;
    } catch (_) {
      // the length is a nicety; the note still plays and translates
    }
  }

  async function translate(f = from, t = to) {
    const version=++requestVersion.current;requestRef.current?.abort();const controller=new AbortController();requestRef.current=controller;
    setError("");
    setPhase("translating");
    try {
      const fd = new FormData();
      fd.append("from", f);
      fd.append("to", t);
      if (SAMPLE_MODE) fd.append("scenario", testScenario);
      if (live && autoOn && !received) { fd.append("auto", "1"); if (family.me) fd.append("me_id", family.me.id); if (withId) fd.append("with_id", withId); }
      if (LIVE_TRANSLATE) {
        if (family.me && withId && !received) { fd.append("from_id", t === "dar" ? family.me.id : withId); fd.append("to_id", t === "dar" ? withId : family.me.id); }
        if (received) fd.append("test", "1");   // a note opened from a file is never posted into the family conversation
        fd.append("source", received ? "received" : "translate"); fd.append("consent", profile.voiceConsent ? "1" : "0"); fd.append("owner", profile.name || "grandchild"); fd.append("family", JSON.stringify(familyWords()));
        const typedText = typed.trim();
        if (!blobRef.current && typedText) fd.append("text", typedText);
        setTypedSent(!blobRef.current && !!typedText);
      }
      if (blobRef.current && !SAMPLE_MODE) {
        let upload = blobRef.current;
        let name = blobRef.current.name || recordingFileName(blobRef.current.type).replace("kebdti-voice-note", "note");
        try {
          upload = await toWav16k(blobRef.current);
          name = "note.wav";
        } catch (_) {
          // keep the original recording if this browser can't decode it
        }
        fd.append("audio", upload, name);
      }
      const data=await backend.translate(fd,controller.signal);
      if(controller.signal.aborted||version!==requestVersion.current)return;
      if (data.unclear) {
        setError(received ? "Kebdti couldn't hear that note clearly. Try another copy of it. It won't guess." : "Kebdti couldn't hear that clearly. Please record it again. It won't guess.");
        setPhase(blobRef.current?"recorded":"idle");
        return;
      }
      if (!data.ok) {
        setError(data.message || "The translation didn't go through. Try again.");
        setPhase(blobRef.current ? "recorded" : "idle");
        return;
      }
      setResult(data);
      setPhase("done");
      setTyped("");
      if (!demo) {
        const saved = await onSaved({
          from: data.from, to: data.to, heard: data.heard, translation: data.translation,
          translit: data.translit, literal: data.literal, feelings: data.feelings, note: data.note, mock:!!data.mock, testBackend:data.backend==="test",
        });
        if(saved)onToast(data.mock?"Sample saved to History":"Saved to History");
      }
    } catch (failure) {
      if(controller.signal.aborted||version!==requestVersion.current)return;
      setError(failure.message||"The translation didn't go through. Check that the app server is running, then try again.");
      setPhase(blobRef.current ? "recorded" : "idle");
    }
  }

  // ---------- sending ----------
  const shareText = useMemo(() => (result ? buildShareText(result) : ""), [result]);
  const waUrl = whatsappUrl(shareText);
  // My own real recording can travel with the text. Samples and received notes never attach audio.
  const attachment = useMemo(() => {
    if (!result || result.mock || received || !blobRef.current) return null;
    try {
      const file = new File([blobRef.current], recordingFileName(blobRef.current.type), { type: blobRef.current.type });
      return navigator.canShare?.({ files: [file] }) ? file : null;
    } catch (_) {
      return null;
    }
  }, [result, received]);

  async function sendOnWhatsApp(event) {
    if (!attachment) return; // the link itself opens WhatsApp with the text
    event.preventDefault();
    try {
      await navigator.share({ files: [attachment], text: `${shareText}\nThe original recording is attached.`, title: "Kebdti" });
    } catch (failure) {
      if (failure?.name === "AbortError") return;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(shareText);
      onToast("Copied");
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch (_) {
      onToast("Copying isn't available in this browser", "alert");
    }
  }

  // Answer a received note: flip the direction and go straight back to the recorder.
  function reply() {
    if (!result) return;
    const quote = result.translation, mine = result.to, theirs = result.from;
    ownPair.current = null;
    reset();
    setFrom(mine);
    setTo(theirs);
    setReplyTo({ text: quote });
    requestAnimationFrame(() => workspaceRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" }));
  }

  const capture = phase === "idle" || phase === "recording" || phase === "recorded";
  const copy = {
    idle: replyTo
      ? { title: "Record your reply", hint: `Speak ${src.hint}. They read it in ${tgt.hint}.` }
      : { title: "Say it your way.", hint: autoOn ? "Speak in your language. Kebdti hears which one and writes what you mean." : `Speak ${src.hint}. Kebdti writes what you mean in ${tgt.hint}.` },
    recording: { title: "Say it your way.", hint: "Tap to finish." },
    recorded: received
      ? { title: "Voice note you received", hint: `Play it, then see what it means in ${tgt.hint}.` }
      : { title: "Got it.", hint: "Play it back, then translate it." },
  }[phase];

  const steps = [
    { icon: "ear", label: autoOn && !received ? "Listening and finding the language" : `Listening to the ${src.hint}` },
    { icon: "heart", label: "Working out what it means" },
    { icon: "languages", label: autoOn && !received ? `Writing it for ${withMember?.name || "your family"}` : `Writing it in ${tgt.hint}` },
  ];

  const feelings = (result?.feelings || []).map(stripEmoji).filter(Boolean);
  const sendHint = !result ? "" : `${attachment ? "Sends your recording with the translation. Choose WhatsApp in the share menu." : "Opens WhatsApp with the translation as text."}${result.mock ? " This is a test sample." : ""}`;
  const ring = "TAP TO TALK · اضغط وتكلم · PARLE · ";
  const floaters = ["كبدتي", "mon cœur", "my darling", "توحشتك", "te quiero", "ik mis je"];
  const langLine = autoOn && !received ? (
    <p className="k-langline k-langline--auto">
      <span>Speak any of</span>
      <span className="k-langline-flags">{LIVE_CODES.map((c) => <Flag key={c} code={c} size={22} />)}</span>
    </p>
  ) : (
    <p className="k-langline">
      <span>{received ? "They speak" : "You speak"}</span><Flag code={from} size={22} />
      <Icon name="arrowRight" size={14} strokeWidth={2.4} />
      <span>{received ? "You read" : "They read"}</span><Flag code={to} size={22} />
    </p>
  );

  return (
    <div className="k-screen k-translate" data-phase={phase}>
      <header className="k-topbar">
        {autoOn && !received ? (
          <div className="k-autobadge" aria-label="Kebdti detects the language">
            <span className="k-autobadge-flags" aria-hidden="true"><Flag code="dar" size={30} /><Flag code={profile.lang && profile.lang !== "dar" ? profile.lang : (profile.familyLang !== "dar" ? profile.familyLang : "en")} size={30} /></span>
            <span className="k-autobadge-text"><b>Auto</b><small>Detects the language</small></span>
          </div>
        ) : (
          <LanguageSwitch from={from} to={to} onSwap={swap} onPick={setPicking} disabled={busy} fromLabel={received ? "They speak" : "You speak"} />
        )}
        <div className="k-topbar-end">
          <ThemeToggle />
          <Avatar name={profile.name} size={40} />
        </div>
      </header>

      <div className="k-voice-col" ref={workspaceRef}>
        {live && capture && phase !== "recording" && !received && (
          <div className="k-family-top">
            <TalkingWith members={family.members} withId={withId} onPick={pickWith} disabled={busy} />
            <FamilyInbox active={active} onToast={onToast} meId={family.me?.id} withMember={withMember} />
          </div>
        )}
        <AnimatePresence initial={false}>
          {conversationPrompt && !replyTo && capture && (
            <motion.div key="prompt" className="k-note-sticker" {...swapIn}>
              <span className="k-note-sticker-label"><Icon name="heart" size={14} filled />A thought to start with</span>
              <p>{conversationPrompt.lead}</p>
              <small>This prompt guides your note; it doesn’t change the translation.</small>
            </motion.div>
          )}
          {replyTo && capture && (
            <motion.div key="reply" className="k-note-sticker k-note-sticker--reply" {...swapIn}>
              <span className="k-note-sticker-label"><Icon name="reply" size={14} />Replying to</span>
              <p dir="auto">“{replyTo.text}”</p>
              <button type="button" className="k-note-sticker-x" onClick={() => setReplyTo(null)} aria-label="Stop replying to this note"><Icon name="x" size={16} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {(phase === "idle" || phase === "recording") && (
            <motion.section key="idle" className="k-hero" {...swapIn}>
              <div className="k-hero-copy">
                <p className="k-hello">Salam, <b>{profile.name}</b>{withMember && !replyTo ? <> · to <b>{withMember.name}</b></> : null}</p>
                <h1 className="k-hero-title">{copy.title === "Say it your way." ? <>Say it <mark className="k-marker">your</mark> way.</> : copy.title}</h1>
                {langLine}
              </div>
              <div className="k-hero-orb">
                <span className="k-ripples" aria-hidden="true"><i /><i /><i /></span>
                <span className="k-floaters" aria-hidden="true">
                  {floaters.map((w, i) => <i key={w} dir="auto" style={{ "--i": i, "--dx": `${(i % 2 ? 1 : -1) * (96 + (i % 3) * 12)}px`, "--dy": `${-40 - (i % 3) * 34}px`, "--r": `${(i % 2 ? 1 : -1) * (4 + i)}deg` }}>{w}</i>)}
                </span>
                <svg className="k-ring-text" viewBox="0 0 200 200" aria-hidden="true">
                  <defs><path id="k-ring-path" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" /></defs>
                  <text><textPath href="#k-ring-path" textLength="538">{ring}{ring}</textPath></text>
                </svg>
                <RecordButton recording={false} stream={null} disabled={micPending || phase === "recording"} onClick={startRecording} />
              </div>
              <p className="k-hero-foot" role={micPending ? "status" : undefined}>
                {micPending ? "Waiting for microphone permission…" : <><Icon name="shield" size={14} />{profile.voiceConsent ? "You agreed to voice copying. Change it in Profile." : "Your voice is never copied without your yes."}</>}
              </p>
            </motion.section>
          )}

          {phase === "translating" && (
            <motion.section key="work" className="k-working" {...swapIn} role="status" aria-live="polite">
              <div className="k-working-flags" aria-hidden="true">
                <span className="k-working-flag"><Flag code={from} size={72} /></span>
                <span className="k-working-path">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ "--i": i }} />)}</span>
                <span className="k-working-flag k-working-flag--to"><Flag code={to} size={72} /></span>
              </div>
              <h1 className="k-hero-title">{SAMPLE_MODE ? "Loading a sample" : "Translating"}</h1>
              {SAMPLE_MODE ? <p className="k-lead">Preparing the test response…</p> : <><p className="k-lead">About 15 seconds. Kebdti listens for the feeling, not just the words.</p><TranslateSteps steps={steps} /></>}
            </motion.section>
          )}

          {phase === "recorded" && (
            <motion.section key="review" className="k-review" {...swapIn}>
              <h1 className="k-hero-title">{copy.title}</h1>
              {langLine}
              <p className="k-lead">{copy.hint}</p>
              <div className="k-review-note">
                {received && <span className="k-msg-who"><Icon name="inbox" size={14} />From your files</span>}
                <AudioPill src={origUrl} duration={seconds} side="center" label={received ? shorten(fileName) : "Your voice note"} tone="saffron" seed={3} />
              </div>
              <div className="k-review-actions">
                <Button block onClick={() => translate()}><span className="k-btn-flag" aria-hidden="true"><Flag code={to} size={24} /></span>Translate into {tgt.hint}</Button>
                {received ? (
                  <div className="k-review-pair">
                    <Button variant="secondary" icon="inbox" onClick={() => fileInputRef.current?.click()}>Choose another</Button>
                    <Button variant="ghost" onClick={newNote}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="secondary" icon="rotate" block onClick={reset}>Record again</Button>
                )}
              </div>
            </motion.section>
          )}

          {phase === "done" && result && (
            <motion.section key="result" className="k-result" variants={stagger} initial="hidden" animate="show" exit="exit">
              <motion.div variants={fadeUp} className="k-heard">
                <span className="k-heard-flag"><Flag code={result.from} size={28} /></span>
                <div className="k-heard-body">
                  <span className="k-msg-who">{received ? "They said" : "You said"} · {LANG[result.from].hint}{result.mock ? " · sample" : ""}{result.detected && autoOn && !received ? <span className="k-detected"><Icon name="ear" size={13} />heard by itself</span> : null}</span>
                  <p className="k-msg-heard" dir="auto">{result.heard}</p>
                  <AudioPill src={origUrl} duration={seconds} side="in" compact label={received ? "The note you opened" : typedSent ? "You typed this" : "Original recording"} tone="saffron" seed={3} disabled={!origUrl} onUnavailable={() => onToast(typedSent ? "You typed this message" : "No recording in the sample")} />
                </div>
              </motion.div>

              <motion.article className="k-sticker"
                initial={{ opacity: 0, y: 40, rotate: -9, scale: 0.9 }} animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}>
                <span className="k-sticker-stamp"><Flag code={result.to} size={56} /></span>
                <span className="k-burst" aria-hidden="true">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <i key={i} style={{ "--a": `${i * 36}deg`, "--d": `${54 + (i % 3) * 16}px` }}><Icon name="heart" size={i % 3 ? 14 : 18} filled strokeWidth={1.2} /></i>)}
                </span>
                <h1 className="k-meaning-label" tabIndex={-1} ref={resultHead}>
                  {received ? "They said, in" : "In"} {LANG[result.to].hint}{result.mock ? " · sample translation" : ""}
                </h1>
                <p className="k-meaning-text" dir="auto">
                  {result.translation.split(/(\s+)/).map((part, i) => (/^\s+$/.test(part) ? part : <span key={i} className="k-word" style={{ "--i": Math.floor(i / 2) }}>{part}</span>))}
                </p>
                {result.translit && <p className="k-translit">{result.translit}</p>}
                {result.literal && <p className="k-literal"><span>Word for word</span><s>{result.literal}</s></p>}
                <div className="k-meaning-voice">
                  <AudioPill src={result.audioUrl || undefined} speak={result.audioUrl ? undefined : { text: result.translation, lang: result.ttsLang }} label={result.cloned ? (result.to === "dar" ? "In your own voice" : `In ${withMember?.role === "grandfather" ? "his" : "her"} own voice`) : "Read aloud"} tone="ink" side="center" seed={11} />
                  {result.cloned ? <p className="k-small">{result.to === "dar" ? "Your own voice, with your consent." : "Their own voice, cloned with their consent."}</p>
                    : result.to === "dar" && live && !voiceReady ? <p className="k-small k-voice-nudge">They hear a Kebdti voice for now, not yours. <button type="button" onClick={() => document.getElementById("my-voice")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Set up my voice (15–30 s)</button></p>
                    : <p className="k-small">{result.audioUrl ? "A Kebdti voice." : "Device voice · not a copy of anyone’s voice."}</p>}
                </div>
                {feelings.length > 0 && (
                  <div className="k-feelings">
                    {feelings.map((f, i) => <span key={f} className="k-feeling" style={{ "--i": i }}>{f.toLowerCase()}</span>)}
                  </div>
                )}
              </motion.article>

              {result.note && (
                <motion.div variants={fadeUp} className="k-why">
                  <span className="k-why-label">Why it’s said this way</span>
                  <p>{result.note}</p>
                </motion.div>
              )}

              {live && !received && !result.mock && result.to === "dar" && withMember && (
                <motion.p variants={fadeUp} className="k-delivered"><Icon name="check" size={16} strokeWidth={2.6} />Sent to {withMember.name}’s phone, in Darija.</motion.p>
              )}
              <motion.div variants={fadeUp} className="k-send">
                {received ? (
                  <Button icon="reply" block onClick={reply}>Reply in {LANG[result.to].hint}</Button>
                ) : (
                  <a className="k-btn k-btn--primary k-btn--md k-btn--block k-wa" href={waUrl} target="_blank" rel="noopener noreferrer" onClick={sendOnWhatsApp}>
                    <Icon name="message" size={20} className="k-btn-icon" /><span className="k-btn-label">Send on WhatsApp</span>
                  </a>
                )}
                <div className="k-quicks">
                  {received && (
                    <a className="k-quick" href={waUrl} target="_blank" rel="noopener noreferrer" aria-label="Send the translation on WhatsApp">
                      <Icon name="message" size={18} /><span>WhatsApp</span>
                    </a>
                  )}
                  <button type="button" className={`k-quick${copied ? " is-done" : ""}`} onClick={copyText} aria-label="Copy the text">
                    <span key={copied ? "done" : "copy"} className="k-quick-icon"><Icon name={copied ? "check" : "copy"} size={18} strokeWidth={copied ? 2.6 : 1.9} /></span>
                    <span>{copied ? "Copied" : "Copy text"}</span>
                  </button>
                  <button type="button" className="k-quick" onClick={newNote} aria-label="Record a new note">
                    <Icon name="mic" size={18} /><span>New note</span>
                  </button>
                </div>
                {!received && <p className="k-small k-center-text">{sendHint}</p>}
              </motion.div>

              <motion.p variants={fadeUp} className="k-ai-line">
                <Icon name="info" size={14} />
                {result.mock ? "Interface test sample. No AI translation or voice copying took place." : "Translated by AI, so it can be wrong. Check the meaning before sharing."}
              </motion.p>
            </motion.section>
          )}
        </AnimatePresence>

        {capture && phase !== "recording" && (
          <div className="k-after-stage">
            {phase === "idle" && (
              <div className="k-options">
                <button type="button" className="k-option" aria-label="Open a voice note you received" onClick={() => fileInputRef.current?.click()}>
                  <Icon name="inbox" size={18} /><span>Open a received note</span>
                </button>
                {SAMPLE_MODE && (
                  <button type="button" className="k-option" aria-label="Try a sample without recording" onClick={() => translate()}>
                    <Icon name="play" size={16} /><span>Try a sample</span>
                  </button>
                )}
              </div>
            )}
            {LIVE_TRANSLATE && phase === "idle" && (
              <form className="k-typerow" onSubmit={(e) => { e.preventDefault(); if (typed.trim()) translate(); }}>
                <input className="k-typerow-input" dir="auto" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={autoOn ? "Or type a message" : from === "dar" ? "أو كتب بالدارجة…" : `Or type it in ${src.hint}`} aria-label={autoOn ? "Type a message" : `Type a message in ${src.hint}`} />
                <button type="submit" className="k-typerow-go" disabled={!typed.trim()} aria-label="Translate the typed message"><Icon name="arrowRight" size={20} strokeWidth={2.4} /></button>
              </form>
            )}
            <AnimatePresence>{error && <Alert key="err">{error}</Alert>}</AnimatePresence>
            {live && phase === "idle" && (
              <div className="k-autorow">
                <div className="k-autorow-text">
                  <b>Detect the language for me</b>
                  <small>{auto ? "Just talk. Kebdti hears Darija, English, French, Spanish or Italian." : "You choose the two languages at the top."}</small>
                </div>
                <Switch checked={auto} onChange={(v) => !busy && setAuto(v)} label="Detect the language for me" />
              </div>
            )}
            {live && phase === "idle" && family.me && (
              <div id="my-voice" className="k-myvoice"><VoiceSetup memberId={family.me.id} name={family.me.name} lang={family.me.lang || "en"} active={active} onStatus={setVoiceReady} onToast={onToast} /></div>
            )}
            {SAMPLE_MODE && <p className="k-small k-center-text">{received ? "Test mode uses an authored example, not a transcription of this voice note. The file stays on this device." : "Test mode uses an authored example, not a transcription of your recording. Your microphone recording stays local."}</p>}
          </div>
        )}
        <input ref={fileInputRef} type="file" hidden tabIndex={-1} aria-label="Voice note file" accept="audio/*,.opus,.ogg,.oga,.m4a,.mp3,.wav,.webm,.aac,.amr,.3gp,.mp4" onChange={openReceived} />
      </div>

      {mounted && active && createPortal(
        <AnimatePresence>
          {phase === "recording" && (
            <motion.div key="flood" className="k-flood"
              initial={{ clipPath: "circle(0% at 50% 62%)" }} animate={{ clipPath: "circle(150% at 50% 62%)" }} exit={{ clipPath: "circle(0% at 50% 62%)", transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}>
              <div className="k-flood-inner">
                <span className="k-flood-pair" aria-hidden="true"><Flag code={from} size={36} /><Icon name="arrowRight" size={18} /><Flag code={to} size={36} /></span>
                <p className="k-flood-label">Listening…</p>
                <div className="k-flood-time k-tnum">{fmt(seconds)}</div>
                <p className="k-flood-max k-tnum">of {fmt(MAX_SECONDS)}</p>
                <div className="k-flood-wave"><LiveWaveform stream={stream} /></div>
                <RecordButton recording stream={stream} onClick={stopRecording} />
                <button type="button" className="k-flood-cancel" onClick={cancelRecording}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <LanguageSheet
        open={!!picking}
        title={picking === "from" ? (received ? "They speak" : "You speak") : "Translate into"}
        value={picking === "from" ? from : to}
        onPick={pickLanguage}
        onClose={closePicker}
      />
    </div>
  );
}
