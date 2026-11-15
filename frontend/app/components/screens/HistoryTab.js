"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../icons";
import { Button, EmptyState, IconButton } from "../ui";
import { AudioPill } from "../audio";
import { LANG } from "../../lib/languages";
import { timeAgo } from "../../lib/store";

const ease = [0.22, 1, 0.36, 1];

function dayLabel(ts) {
  const d = new Date(ts), today = new Date();
  const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(today) - start(d)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: diff < 7 ? "long" : undefined, day: "numeric", month: "long" });
}

export function HistoryTab({ items, onDelete, onGoTranslate, onBack, account = false }) {
  const [openId, setOpenId] = useState(null);
  const groups = useMemo(() => {
    const out = [];
    for (const h of items) {
      const label = dayLabel(h.at);
      if (!out.length || out[out.length - 1].label !== label) out.push({ label, items: [] });
      out[out.length - 1].items.push(h);
    }
    return out;
  }, [items]);

  const head = (
    <header className="k-hist-head">
      {onBack && <IconButton icon="arrowLeft" label="Back to Profile" variant="plain" onClick={onBack} />}
      <div>
        <h1 className="k-h1">History</h1>
        {items.length > 0 && <p className="k-lead">{items.length} translated {items.length === 1 ? "note" : "notes"}, saved {account ? "in your test account" : "on this device"}. Tap one to see more.</p>}
      </div>
    </header>
  );

  if (!items.length) {
    return (
      <div className="k-screen k-history">
        {head}
        <EmptyState title="No voice notes yet" body="Every note you translate is saved here, so you can read and listen to it again." action={<Button icon="mic" onClick={onGoTranslate}>Record a voice note</Button>} />
      </div>
    );
  }

  let n = 0;
  return (
    <div className="k-screen k-history">
      {head}
      <div className="k-timeline">
        {groups.map((g) => (
          <section key={g.label} className="k-day">
            <h2 className="k-day-label"><span>{g.label}</span></h2>
            <ul className="k-day-list">
              <AnimatePresence initial={false}>
                {g.items.map((h) => {
                  const open = openId === h.id;
                  const feelings = (h.feelings || []).filter(Boolean);
                  const i = n++;
                  return (
                    <motion.li key={h.id} className={`k-note${open ? " is-open" : ""}`} style={{ "--i": Math.min(i, 8) }}
                      exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0, transition: { duration: 0.24 } }}>
                      <span className="k-note-dot" aria-hidden="true" />
                      <div className="k-note-card">
                        <button type="button" className="k-note-sum" onClick={() => setOpenId(open ? null : h.id)} aria-expanded={open}>
                          <span className="k-note-top">
                            <span className="k-note-pair">
                              {h.mock && <span className="k-tag k-tag--terra">Sample</span>}
                              {LANG[h.from]?.label} <Icon name="arrowRight" size={13} /> {LANG[h.to]?.label}
                            </span>
                            <span className="k-small">{timeAgo(h.at)}</span>
                          </span>
                          <span className="k-note-text" dir="auto">{h.translation}</span>
                          {!open && <span className="k-note-heard" dir="auto">{h.heard}</span>}
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div key="more" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease }} style={{ overflow: "hidden" }}>
                              <div className="k-note-more">
                                {h.translit && <p className="k-translit">{h.translit}</p>}
                                <p className="k-body" dir="auto">{h.mock ? "Sample source phrase: " : "You said: "}{h.heard}</p>
                                {feelings.length > 0 && <div className="k-feelings">{feelings.map((f, j) => <span key={f} className="k-feeling" style={{ "--i": j }}>{f.toLowerCase()}</span>)}</div>}
                                {h.note && <div className="k-why"><span className="k-why-label"><Icon name="heart" size={15} strokeWidth={2} />Why it’s said this way</span><p>{h.note}</p></div>}
                                <div className="k-note-actions">
                                  <AudioPill speak={{ text: h.translation, lang: LANG[h.to]?.tts }} label="Read aloud" tone="olive" side="center" compact seed={h.at % 97} />
                                  <IconButton icon="trash" label="Delete this note" size={48} onClick={() => { setOpenId(null); onDelete(h.id); }} />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
