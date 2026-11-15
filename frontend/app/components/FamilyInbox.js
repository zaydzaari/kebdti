"use client";

// Voice notes from grandma's phone, arriving live in the grandchild's app, already translated with the feeling.
import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";
import { AudioPill } from "./audio";
import { LANG } from "../lib/languages";

const SEEN_KEY = "kebdti-inbox-seen";
const readSeen = () => { try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]")); } catch { return new Set(); } };
function ago(ms) {
  const m = Math.floor((Date.now() - ms) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h} h ago` : new Date(ms).toLocaleDateString();
}
const seedOf = id => [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 97;

export function FamilyInbox({ active, onToast, meId, withMember }) {
  const [items, setItems] = useState([]);
  const [seen, setSeen] = useState(() => new Set());
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const known = useRef(null);

  useEffect(() => { setSeen(readSeen()); }, []);
  const withId = withMember?.id;
  useEffect(() => { known.current = null; setItems([]); setShowAll(false); }, [withId]);
  useEffect(() => {
    if (!active) return;
    let stop = false;
    async function load() {
      try {
        const url = meId && withId ? `/api/family?a=${meId}&b=${withId}` : "/api/family";
        const r = await fetch(url, { cache: "no-store" }).then(r => r.json());
        if (stop || !r.ok) return;
        const list = r.items.filter(m => m.direction === "from_grandparent" && m.source !== "translate" && (!withId || m.fromId === withId));
        if (known.current && list.some(m => !known.current.has(m.id))) onToast?.(`New voice note from ${withMember?.name || "your family"}`, "heart");
        known.current = new Set(list.map(m => m.id));
        setItems(list.slice(-5).reverse());
      } catch { /* translator offline: the inbox simply stays as it is */ }
    }
    load();
    const t = setInterval(load, 4000);
    return () => { stop = true; clearInterval(t); };
  }, [active, onToast, meId, withId, withMember?.name]);

  function markSeen(id) {
    setSeen(prev => { const next = new Set(prev); next.add(id); try { localStorage.setItem(SEEN_KEY, JSON.stringify([...next].slice(-300))); } catch {} return next; });
  }

  if (!items.length) return null;
  return (
    <section className="inbox" aria-label="From your family">
      <div className="workspace-heading"><h2>From {withMember?.name || "your family"}</h2><Icon name="heart" size={18} /></div>
      <AnimatePresence initial={false}>
        {(showAll ? items : items.slice(0, 1)).map(m => {
          const isNew = !seen.has(m.id), open = expanded === m.id;
          const notes = m.notes.filter(n => !String(n.meaning || "").toLowerCase().startsWith("uncertain"));
          const hasMore = !!(m.literal || notes.length || m.original);
          return (
            <motion.article key={m.id} className={`inbox-card${isNew ? " is-new" : ""}${open ? " is-open" : ""}`} layout
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={() => markSeen(m.id)}>
              <header className="inbox-head">
                <span className="inbox-from"><Icon name="voice" size={15} /> Voice note in Darija</span>
                <span className="inbox-time">{isNew ? <b>New</b> : ago(m.at)}</span>
              </header>
              <p className="inbox-text" dir="auto">{m.text}</p>
              <AudioPill src={m.audioUrl || undefined} label={m.cloned ? (withMember?.role === "grandfather" ? "In his own voice" : "In her own voice") : "Listen"} tone="olive" seed={seedOf(m.id)} />
              {m.feelings.length > 0 && (
                <p className="feel-line"><span>Feels like</span>
                  {m.feelings.map((f, i) => <Fragment key={f}><b>{f}</b>{i < m.feelings.length - 1 && <span className="feel-sep">·</span>}</Fragment>)}
                </p>
              )}
              {m.unsure && <p className="fine-print inbox-unsure"><Icon name="info" size={15} /> Kebdti isn't sure about part of this message. Ask what they meant.</p>}
              {open && (
                <div className="inbox-more">
                  {m.cloned && <p className="fine-print">{withMember?.role === "grandfather" ? "His own voice, cloned with his consent." : "Her own voice, cloned with her consent."}</p>}
                  {m.literal && <p className="literal"><span>Word for word:</span><s>{m.literal}</s></p>}
                  {notes.length > 0 && (
                    <div className="note"><span className="note-label"><Icon name="heart" size={15} strokeWidth={2} /> Why it's said this way</span>
                      <p>{notes.map(n => `“${n.expression}” literally means “${String(n.literal || "").replace(/[.。]+$/, "")}”: ${n.meaning}`).join("\n")}</p>
                    </div>
                  )}
                  {m.original && <div className="inbox-orig"><span>{withMember?.role === "grandfather" ? "What he said in Darija" : "What she said in Darija"}</span><p dir="rtl" lang="ar">{m.original}</p></div>}
                </div>
              )}
              {hasMore && (
                <button type="button" className="inbox-toggle" aria-expanded={open} onClick={e => { e.stopPropagation(); markSeen(m.id); setExpanded(open ? null : m.id); }}>
                  {open ? "Less" : "Why it's said this way"}<Icon name="chevron" size={16} style={{ transform: open ? "rotate(180deg)" : "none" }} />
                </button>
              )}
            </motion.article>
          );
        })}
      </AnimatePresence>
      {items.length > 1 && (
        <button type="button" className="text-action inbox-more-btn" aria-expanded={showAll} onClick={() => setShowAll(v => !v)}>
          {showAll ? "Show only the newest" : `${items.length - 1} earlier voice note${items.length > 2 ? "s" : ""}`}
          <Icon name="chevron" size={16} style={{ transform: showAll ? "rotate(180deg)" : "none" }} />
        </button>
      )}
    </section>
  );
}
