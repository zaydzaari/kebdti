"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";
import { STARTERS } from "../lib/family";
import { PHRASES } from "../lib/phrases";

const ease = [0.22, 1, 0.36, 1];

// Conversation starters as a deck: swipe the top card away (or tap shuffle) and the next one rises.
export function StarterCard({ onStart, compact = false }) {
  const [index, setIndex] = useState(0);
  const [fling, setFling] = useState(1);
  const item = STARTERS[index];
  const next = (dir = 1) => { setFling(dir); setIndex((i) => (i + 1) % STARTERS.length); };

  return (
    <section className={`k-deck${compact ? " is-compact" : ""}`} aria-label="Conversation starter">
      <div className="k-deck-head">
        <span className="k-eyebrow">Something to say</span>
        <span className="k-small k-tnum">{index + 1} / {STARTERS.length}</span>
      </div>
      <div className="k-deck-stack">
        <span className="k-deck-shadow k-deck-shadow--2" aria-hidden="true" />
        <span className="k-deck-shadow k-deck-shadow--1" aria-hidden="true" />
        <AnimatePresence initial={false} custom={fling}>
          <motion.div
            key={item.id}
            className="k-deck-card k-tilt"
            custom={fling}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.7}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) next(info.offset.x < 0 ? -1 : 1); }}
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0 }}
            exit={(d) => ({ opacity: 0, x: d * 260, rotate: d * 14, transition: { duration: 0.35, ease } })}
            transition={{ duration: 0.45, ease }}
            whileDrag={{ rotate: 0, scale: 1.02 }}
          >
            <span className="k-deck-topic">{item.topic}</span>
            <h2 className="k-h2">{item.title}</h2>
            <p className="k-deck-question">“{item.question}”</p>
            <div className="k-deck-actions">
              <button type="button" className="k-link k-deck-go" onClick={() => onStart(item)}>Make a voice note <Icon name="arrowRight" size={16} /></button>
              <button type="button" className="k-deck-shuffle" aria-label="Another conversation starter" onClick={() => next(1)}><Icon name="rotate" size={18} /></button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {!compact && <p className="k-small k-center-text">Swipe the card for another one</p>}
    </section>
  );
}

// The literal words next to what they mean, with a sliding toggle.
export function MeaningLens({ compact = false }) {
  const [index, setIndex] = useState(0), [showMeaning, setShowMeaning] = useState(true), phrase = PHRASES[index];
  return (
    <section className={`k-lens${compact ? " is-compact" : ""}`} aria-label="Meaning lens">
      <div className="k-deck-head"><span className="k-eyebrow">More than the words</span><Icon name="languages" size={18} /></div>
      <div className="k-lens-word" key={phrase.id}>
        <span lang="ar" dir="rtl">{phrase.arabic}</span>
        <span>{phrase.latin}</span>
      </div>
      <div className="k-lens-toggle" role="group" aria-label="Translation perspective" style={{ "--i": showMeaning ? 1 : 0 }}>
        <span className="k-lens-thumb" aria-hidden="true" />
        <button type="button" aria-pressed={!showMeaning} onClick={() => setShowMeaning(false)}>Word for word</button>
        <button type="button" aria-pressed={showMeaning} onClick={() => setShowMeaning(true)}>What they mean</button>
      </div>
      <p key={`${index}-${showMeaning}`} className={`k-lens-answer${showMeaning ? " is-meaning" : ""}`} aria-live="polite">
        {showMeaning ? `“${phrase.meaning}”` : <s>“{phrase.literal}”</s>}
      </p>
      <p className="k-body k-lens-why">{showMeaning ? phrase.note : "The literal words alone can miss the affection. Switch to what they mean to see the difference."}</p>
      {!compact && <button type="button" className="k-link" onClick={() => { setIndex((i) => (i + 1) % PHRASES.length); setShowMeaning(true); }}>Another expression <Icon name="arrowRight" size={16} /></button>}
      <span className="k-small">Authored Darija example · meaning depends on context</span>
    </section>
  );
}
