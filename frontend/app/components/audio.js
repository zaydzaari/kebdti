"use client";

// Kebdti voice elements: the orb, the live waveform, the voice-note bubble and the working steps.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";
import { spring } from "./ui";

export const fmt = (s) => {
  const t = Math.max(0, Math.round(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

// Reads the microphone level (0–1) every frame and hands it to onLevel.
function useMicLevel(stream, onLevel) {
  useEffect(() => {
    if (!stream) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    let ctx;
    try { ctx = new AC(); } catch { return; }
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    try { ctx.createMediaStreamSource(stream).connect(analyser); } catch { ctx.close().catch(() => {}); return; }
    const data = new Uint8Array(analyser.fftSize);
    let raf, last = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 50) return;
      last = t;
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
      onLevel(Math.min(1, Math.sqrt(sum / data.length) * 5));
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); onLevel(0); ctx.close().catch(() => {}); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);
}

// ---------- VoiceOrb (exported as RecordButton) ----------
// A lit sphere. Idle: breathes, with a slow aura. Recording: mic morphs to stop and the glow follows your voice.
export function RecordButton({ recording, onClick, disabled, stream, size = "lg" }) {
  const wrap = useRef(null);
  useMicLevel(recording ? stream : null, (level) => wrap.current?.style.setProperty("--level", level.toFixed(3)));
  return (
    <div ref={wrap} className={`k-orb k-orb--${size}${recording ? " is-rec" : ""}${disabled ? " is-wait" : ""}`}>
      <span className="k-orb-glow" aria-hidden="true" />
      <span className="k-orb-aura" aria-hidden="true" />
      <span className="k-orb-aura k-orb-aura--2" aria-hidden="true" />
      <AnimatePresence>
        {recording && [0, 1, 2].map((i) => (
          <motion.span key={i} className="k-orb-ring" aria-hidden="true"
            initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 1.9, opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }} />
        ))}
      </AnimatePresence>
      <motion.button
        type="button"
        className="k-orb-core"
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.03 }}
        transition={spring}
        aria-label={recording ? "Stop recording" : "Start recording"}
      >
        <span className="k-orb-shine" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          {recording ? (
            <motion.span key="stop" className="k-orb-stop" initial={{ scale: 0, borderRadius: 30 }} animate={{ scale: 1, borderRadius: 10 }} exit={{ scale: 0 }} transition={spring} />
          ) : (
            <motion.span key="mic" className="k-orb-mic" initial={{ scale: 0.4, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.4, opacity: 0 }} transition={spring}>
              <Icon name="mic" size={40} strokeWidth={1.8} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// ---------- LiveWaveform ----------
// Scrolling bars driven by the real microphone level.
export function LiveWaveform({ stream, bars = 40 }) {
  const ref = useRef(null);
  const history = useRef(new Array(bars).fill(0.06));
  useMicLevel(stream, (level) => {
    history.current.shift();
    history.current.push(Math.max(0.06, level));
    const kids = ref.current?.children;
    if (kids) for (let i = 0; i < kids.length; i++) kids[i].style.transform = `scaleY(${history.current[i]})`;
  });
  return (
    <div className="k-livewave" ref={ref} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => <span key={i} />)}
    </div>
  );
}

// ---------- IdleWave: a quiet waveform that says "speak" ----------
export function IdleWave({ bars = 15 }) {
  return <span className="k-idlewave" aria-hidden="true">{Array.from({ length: bars }, (_, i) => <i key={i} style={{ "--n": i }} />)}</span>;
}

// ---------- VoiceBubble (exported as AudioPill) ----------
// A voice note as a chat bubble: play, bars that fill as it plays, and the time.
// `src` plays a file; `speak` reads text aloud with the device voice.
function seededBars(n, seed) {
  let s = seed;
  return Array.from({ length: n }, (_, i) => {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const envelope = Math.sin((i / (n - 1)) * Math.PI) * 0.45 + 0.45;
    return Math.min(1, 0.18 + r * 0.55 * envelope + envelope * 0.3);
  });
}

export function AudioPill({ src, speak, duration = 0, label, tone = "saffron", side = "out", seed = 7, disabled, onUnavailable, compact = false }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const rafRef = useRef(0);
  const bars = useMemo(() => seededBars(compact ? 26 : 34, seed), [seed, compact]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.getVoices();
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (audioRef.current) audioRef.current.pause();
      if (speak && typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    cancelAnimationFrame(rafRef.current);
    if (audioRef.current) audioRef.current.pause();
    if (speak && window.speechSynthesis) window.speechSynthesis.cancel();
    setPlaying(false);
    setProgress(0);
  }

  function play() {
    if (disabled || (!src && !speak)) { onUnavailable && onUnavailable(); return; }
    if (playing) return stop();
    if (src) {
      const a = audioRef.current || (audioRef.current = new Audio());
      a.src = src;
      a.currentTime = 0;
      a.onended = () => { cancelAnimationFrame(rafRef.current); setPlaying(false); setProgress(0); };
      a.play().catch(() => setPlaying(false));
      setPlaying(true);
      const tick = () => {
        const d = isFinite(a.duration) && a.duration > 0 ? a.duration : duration || 1;
        setProgress(Math.min(1, a.currentTime / d));
        if (!a.paused && !a.ended) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    const synth = window.speechSynthesis;
    if (!synth) return onUnavailable && onUnavailable();
    synth.cancel();
    const u = new SpeechSynthesisUtterance(speak.text);
    u.lang = speak.lang || "fr-FR";
    u.rate = 0.95;
    const voice = synth.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith(u.lang.slice(0, 2)));
    if (voice) u.voice = voice;
    const est = Math.max(1.5, speak.text.length / 14);
    const start = performance.now();
    let boundary = false;
    u.onboundary = (e) => { boundary = true; setProgress(Math.min(1, (e.charIndex + (e.charLength || 0)) / speak.text.length)); };
    const tick = () => {
      if (!boundary) setProgress(Math.min(0.96, (performance.now() - start) / 1000 / est));
      rafRef.current = requestAnimationFrame(tick);
    };
    u.onend = u.onerror = () => {
      cancelAnimationFrame(rafRef.current);
      setProgress(1);
      setTimeout(() => { setPlaying(false); setProgress(0); }, 260);
    };
    synth.speak(u);
    setPlaying(true);
    rafRef.current = requestAnimationFrame(tick);
  }

  const lit = Math.round(progress * bars.length);
  // Real length of a generated voice note, read from the file's metadata (no download of the whole file).
  const [srcLength, setSrcLength] = useState(0);
  useEffect(() => {
    if (!src || duration || typeof Audio === "undefined") return;
    let alive = true;
    const probe = new Audio();
    probe.preload = "metadata";
    probe.onloadedmetadata = () => { if (alive && isFinite(probe.duration)) setSrcLength(probe.duration); };
    probe.src = src;
    return () => { alive = false; probe.removeAttribute("src"); };
  }, [src, duration]);
  const total = duration || srcLength || (speak ? Math.max(1.5, speak.text.length / 14) : 0);
  const toneName = tone === "olive" ? "olive" : tone === "ink" ? "ink" : "terra";

  return (
    <div className={`k-voice k-voice--${side} k-voice--${toneName}${compact ? " k-voice--compact" : ""}${disabled ? " is-disabled" : ""}${playing ? " is-playing" : ""}`}>
      <motion.button type="button" className="k-voice-play" onClick={play} whileTap={{ scale: 0.86 }} transition={spring} aria-label={playing ? `Stop ${label}` : `Play ${label}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={playing ? "pause" : "play"} style={{ display: "grid" }} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.14 }}>
            <Icon name={playing ? "pause" : "play"} size={18} filled strokeWidth={1.2} />
          </motion.span>
        </AnimatePresence>
      </motion.button>
      <div className="k-voice-body">
        <div className="k-voice-bars" aria-hidden="true">
          {bars.map((h, i) => <span key={i} className={i < lit ? "is-lit" : ""} style={{ "--h": h, "--n": i }} />)}
        </div>
        <div className="k-voice-meta">
          <span className="k-voice-label">{label}</span>
          <span className="k-tnum">{fmt(playing ? progress * total : total)}</span>
        </div>
      </div>
    </div>
  );
}

// ---------- TranslateSteps ----------
export function TranslateSteps({ steps }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 760);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ol className="k-worksteps">
      {steps.map((s, i) => {
        const state = i < step ? "done" : i === step ? "now" : "todo";
        return (
          <li key={s.label} className={`is-${state}`} style={{ "--i": i }}>
            <span className="k-workstep-icon">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={state === "done" ? "done" : "icon"} style={{ display: "grid" }} initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }} transition={spring}>
                  <Icon name={state === "done" ? "check" : s.icon} size={16} strokeWidth={state === "done" ? 2.6 : 1.9} />
                </motion.span>
              </AnimatePresence>
            </span>
            <span>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------- ThinkingBars: shown while a translation is on its way ----------
export function ThinkingBars() {
  return <span className="k-thinking" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ "--n": i }} />)}</span>;
}
