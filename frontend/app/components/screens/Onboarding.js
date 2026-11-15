"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../icons";
import { Button, Steps } from "../ui";
import { RecordButton } from "../audio";

const ease = [0.22, 1, 0.36, 1];
const at = (delay, extra = {}) => ({ initial: { opacity: 0, y: 14, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { delay, duration: 0.5, ease, ...extra } });

function Bars({ n = 18, playing = true }) {
  const h = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9, 0.45, 0.7, 0.35, 0.6, 0.8, 0.5, 0.3, 0.65, 0.9, 0.55, 0.4];
  return <span className={`k-mini-bars${playing ? " is-playing" : ""}`} aria-hidden="true">{h.slice(0, n).map((v, i) => <i key={i} style={{ "--h": v, "--n": i }} />)}</span>;
}

// Scene 1: the word-for-word problem, played out as a conversation.
function SceneNote() {
  return (
    <div className="k-scene k-scene--note">
      <motion.div className="k-bubble k-bubble--in" {...at(0.1)}>
        <span className="k-bubble-who"><span className="k-mini-avatar">F</span>Mi Fatna · voice note · 0:06</span>
        <span className="k-bubble-ar" lang="ar" dir="rtl">كبدتي، فوقاش غادي تجي؟</span>
        <Bars />
      </motion.div>
      <motion.div className="k-bubble k-bubble--wrong" {...at(0.65)}>
        <span className="k-bubble-who">Word-for-word translation</span>
        <span><span className="k-bubble-strike">“My liver, when are you going to come?”</span></span>
      </motion.div>
      <motion.div className="k-bubble k-bubble--out" {...at(1.55, { type: "spring", stiffness: 320, damping: 20 })}>
        <span className="k-bubble-who"><Icon name="heart" size={13} filled />Kebdti</span>
        “My darling, when are you coming to see me?”
      </motion.div>
    </div>
  );
}

// Scene 2: record → meaning → WhatsApp, joined by a drawn thread.
function SceneFlow() {
  return (
    <div className="k-scene k-scene--flow">
      <motion.div className="k-flow-orb" aria-hidden="true" {...at(0.05)}><RecordButton size="sm" disabled /></motion.div>
      <motion.span className="k-flow-thread" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.45, duration: 0.5, ease }} />
      <motion.div className="k-flow-card" {...at(0.8)}>
        <span className="k-flow-label">It means</span>
        <span className="k-flow-text">“My darling, when are you coming?”</span>
        <span className="k-flow-note"><Icon name="heart" size={13} />kebdti is what grandmothers call the ones they love</span>
      </motion.div>
      <motion.span className="k-flow-thread" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.2, duration: 0.45, ease }} />
      <motion.div className="k-flow-send" {...at(1.5, { type: "spring", stiffness: 320, damping: 20 })}>
        <Icon name="message" size={18} />Send on WhatsApp
      </motion.div>
    </div>
  );
}

// Scene 3: the family, and three promises that tick in.
function SceneTrust() {
  const promises = [
    { title: "Your voice, only with your yes", sub: "Kebdti asks before it copies how you sound." },
    { title: "Always marked as AI", sub: "Every translation says it was made by AI." },
    { title: "It asks instead of guessing", sub: "If a recording is unclear, you’re asked again." },
  ];
  return (
    <div className="k-scene k-scene--trust">
      <motion.img className="k-scene-art" src="/illustrations/family-clay.webp" width="640" height="400" alt="A grandmother and her grandchild connected across two doorways" {...at(0.05)} />
      <ul className="k-promises">
        {promises.map((p, i) => (
          <motion.li key={p.title} {...at(0.4 + i * 0.22)}>
            <motion.span className="k-promise-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.22, type: "spring", stiffness: 420, damping: 16 }}>
              <Icon name="check" size={14} strokeWidth={3} />
            </motion.span>
            <span><b>{p.title}</b><small>{p.sub}</small></span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const SLIDES = [
  { Scene: SceneNote, title: <>She says <em>kebdti</em>. A translator hears “my liver”.</>, body: "In Darija, kebdti means my darling. Word-for-word translation keeps the words and loses what she meant. Kebdti translates the meaning." },
  { Scene: SceneFlow, title: "Speak your language. They hear theirs.", body: "Record a voice note, check what it means, then send it on WhatsApp like any other voice note. No new chat app to learn." },
  { Scene: SceneTrust, title: "Your voice stays yours.", body: "Kebdti is a student project and its translations can be wrong. That’s why it’s careful about these three things." },
];

export function Onboarding({ onDone, finishLabel = "Get started" }) {
  const [[index, dir], setPage] = useState([0, 1]);
  const last = index === SLIDES.length - 1;
  const go = (next) => { if (next >= 0 && next < SLIDES.length) setPage([next, next > index ? 1 : -1]); };
  const { Scene, title, body } = SLIDES[index];

  return (
    <div className="k-screen k-onb">
      <div className="k-onb-top">
        <Steps count={SLIDES.length} current={index} label={`Step ${index + 1} of ${SLIDES.length}`} />
        {!last && <Button variant="ghost" size="sm" onClick={onDone}>Skip</Button>}
      </div>

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={index}
          className="k-onb-slide"
          custom={dir}
          variants={{ enter: (d) => ({ opacity: 0, x: d * 48 }), center: { opacity: 1, x: 0 }, leave: (d) => ({ opacity: 0, x: d * -48 }) }}
          initial="enter" animate="center" exit="leave"
          transition={{ duration: 0.4, ease }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
          onDragEnd={(_, info) => { if (info.offset.x < -60) go(index + 1); else if (info.offset.x > 60) go(index - 1); }}
        >
          <div className="k-onb-stage"><Scene /></div>
          <div className="k-onb-copy">
            <h1 className="k-h1 k-onb-title">{title}</h1>
            <p className="k-lead">{body}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="k-onb-foot">
        {index > 0 && <Button variant="secondary" onClick={() => go(index - 1)}>Back</Button>}
        <Button block iconEnd="arrowRight" className="k-btn--shine" onClick={() => (last ? onDone() : go(index + 1))}>{last ? finishLabel : "Next"}</Button>
      </div>
    </div>
  );
}
