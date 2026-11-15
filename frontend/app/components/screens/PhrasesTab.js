"use client";

import { useMemo, useState } from "react";
import { LIVE_TRANSLATE } from "../../lib/backend";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../icons";
import { Chip, PageHeader } from "../ui";
import { CATEGORIES, PHRASES } from "../../lib/phrases";

const ease = [0.22, 1, 0.36, 1];

function speakArabic(text) {
  const synth = typeof window !== "undefined" && window.speechSynthesis;
  if (!synth) return false;
  const voice = synth.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith("ar"));
  if (!voice) return false;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice; u.lang = voice.lang; u.rate = 0.9;
  synth.speak(u);
  return true;
}

// Match on any part of a phrase, ignoring case and accents, so "cheri" finds "chéri".
const fold = (s = "") => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const haystack = (p) => fold([p.arabic, p.latin, p.literal, p.meaning, p.fr, p.note].join(" "));
const dayIndex = () => Math.floor(Date.now() / 86400000) % PHRASES.length;

// Grandma's own voice for Darija phrases (live mode); the device voice is the fallback.
let phraseAudio = null;
async function speakPhrase(text) {
  if (LIVE_TRANSLATE) {
    try {
      const res = await fetch("/api/speak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const r = await res.json();
      if (res.ok && r.audioUrl) {
        window.speechSynthesis?.cancel();
        phraseAudio?.pause();
        phraseAudio = new Audio(r.audioUrl);
        await phraseAudio.play();
        return true;
      }
    } catch {}
  }
  return speakArabic(text);
}

export function PhrasesTab({ onToast, lang }) {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const featured = PHRASES[dayIndex()];

  const list = useMemo(() => {
    const q = fold(query.trim());
    return PHRASES.filter((p) => (cat === "all" || p.category === cat) && (!q || haystack(p).includes(q)));
  }, [cat, query]);

  const listen = (p) => { speakPhrase(p.arabic).then((ok) => { if (!ok) onToast("No Arabic voice on this device", "info"); }); };
  async function copy(p) {
    try { await navigator.clipboard.writeText(`${p.arabic}\n${p.latin}\n${p.meaning}`); onToast("Copied"); }
    catch (_) { onToast("Copying isn't available in this browser", "alert"); }
  }

  return (
    <div className="k-screen k-phrases">
      <PageHeader eyebrow="Phrasebook" title="More than a translation" sub="Darija expressions that word-for-word translation gets wrong. Tap one to see what it really means." />

      <article className="k-featured k-tilt">
        <span className="k-featured-label"><Icon name="heart" size={13} filled />Phrase of the day</span>
        <span className="k-featured-ar" lang="ar" dir="rtl">{featured.arabic}</span>
        <span className="k-featured-latin">{featured.latin}</span>
        <div className="k-featured-means">
          <s>{featured.literal}<i aria-hidden="true" /></s>
          <Icon name="arrowRight" size={16} />
          <b>{featured.meaning}</b>
        </div>
        <button type="button" className="k-featured-play" onClick={() => listen(featured)} aria-label={`Listen to ${featured.latin}`}><Icon name="volume" size={20} /></button>
      </article>

      <div className="k-phrase-tools">
        <label className="k-search">
          <Icon name="search" size={18} />
          <span className="k-sr">Search expressions</span>
          <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setOpenId(null); }} placeholder="Search by word or meaning" autoComplete="off" enterKeyHint="search" />
          {query && <button type="button" className="k-search-clear" aria-label="Clear search" onClick={() => setQuery("")}><Icon name="x" size={16} /></button>}
        </label>
        <div className="k-chips" role="group" aria-label="Filter by kind">
          {CATEGORIES.map((c) => (
            <Chip key={c.id} on={c.id === cat} count={c.id === "all" ? PHRASES.length : PHRASES.filter((p) => p.category === c.id).length} onClick={() => { setCat(c.id); setOpenId(null); }}>{c.label}</Chip>
          ))}
        </div>
      </div>

      <p className="k-sr" role="status">{list.length} {list.length === 1 ? "expression" : "expressions"} shown</p>

      {list.length === 0 ? (
        <div className="k-word-empty">
          <span lang="ar" dir="rtl">؟</span>
          <div>
            <p className="k-h3">No expression matches “{query.trim()}”</p>
            <button type="button" className="k-link" onClick={() => { setQuery(""); setCat("all"); }}>Show all expressions <Icon name="arrowRight" size={16} /></button>
          </div>
        </div>
      ) : (
        <ul className="k-phrase-list" key={`${cat}-${query}`}>
          {list.map((p, i) => {
            const open = openId === p.id;
            return (
              <li key={p.id} className={`k-phrase${open ? " is-open" : ""}`} style={{ "--i": Math.min(i, 8) }}>
                <button type="button" className="k-phrase-sum" aria-expanded={open} aria-controls={`phrase-${p.id}`} onClick={() => setOpenId(open ? null : p.id)}>
                  <span className="k-phrase-text">
                    <span className="k-phrase-latin">{p.latin}</span>
                    <span className="k-phrase-meaning">{p.meaning}</span>
                  </span>
                  <span className="k-phrase-ar" lang="ar" dir="rtl">{p.arabic}</span>
                  <Icon name="chevron" size={18} className="k-phrase-chev" />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div id={`phrase-${p.id}`} key="detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease }} style={{ overflow: "hidden" }}>
                      <div className="k-phrase-detail">
                        <dl className="k-phrase-rows">
                          <dt>Word for word</dt><dd><s>{p.literal}</s></dd>
                          <dt>Means</dt><dd className="is-means">{p.meaning}</dd>
                          {lang === "fr" && p.fr && <><dt>In French</dt><dd lang="fr">{p.fr}</dd></>}
                        </dl>
                        <p className="k-body">{p.note}</p>
                        <div className="k-phrase-actions">
                          <button type="button" className="k-quick k-quick--row" onClick={() => listen(p)} aria-label={`Listen to ${p.latin}`}><Icon name="volume" size={18} /><span>Listen</span></button>
                          <button type="button" className="k-quick k-quick--row" onClick={() => copy(p)} aria-label={`Copy ${p.latin}`}><Icon name="copy" size={18} /><span>Copy</span></button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}
      <p className="k-small">Authored Darija examples. Meaning depends on who says it and when.</p>
    </div>
  );
}
