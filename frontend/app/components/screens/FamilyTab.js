"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../icons";
import { Alert, Button, PageHeader, TextField } from "../ui";
import { MeaningLens, StarterCard } from "../family";
import { readFamilyWords, writeFamilyWords } from "../../lib/family";

const ease = [0.22, 1, 0.36, 1];

export function FamilyTab({ owner, onStart, onToast }) {
  const [words, setWords] = useState([]), [word, setWord] = useState(""), [meaning, setMeaning] = useState(""), [who, setWho] = useState(""), [adding, setAdding] = useState(false), [error, setError] = useState("");
  useEffect(() => { setWords(readFamilyWords(owner)); }, [owner]);
  function save(event) {
    event.preventDefault();
    if (!word.trim() || !meaning.trim()) { setError("Add the expression and what it means before saving."); return; }
    const next = [{ id: crypto.randomUUID(), word: word.trim(), meaning: meaning.trim(), who: who.trim() }, ...words].slice(0, 30);
    if (!writeFamilyWords(owner, next)) { setError("This browser could not save the expression. Try freeing some device storage."); return; }
    setWords(next); setWord(""); setMeaning(""); setWho(""); setAdding(false); setError(""); onToast("Family expression saved on this device");
  }
  function remove(id) {
    const next = words.filter((item) => item.id !== id);
    if (!writeFamilyWords(owner, next)) { setError("The expression could not be removed. Try again."); return; }
    setWords(next);
  }

  return (
    <div className="k-screen k-family">
      <PageHeader eyebrow="Between us" title="Keep the words that feel like home" sub="The stories you haven’t asked for yet. The names only your family uses." />

      <div className="k-family-top">
        <StarterCard onStart={onStart} />
        <MeaningLens />
      </div>

      <section className="k-words k-reveal">
        <div className="k-words-head">
          <div>
            <h2 className="k-h2">Only our family says that</h2>
            <p className="k-small">Nicknames, little sayings, and what they mean to you</p>
          </div>
          <Button variant={adding ? "secondary" : "primary"} size="sm" icon={adding ? "x" : "plus"} onClick={() => setAdding((v) => !v)}>{adding ? "Close" : "Add an expression"}</Button>
        </div>
        <p className="k-store-note"><Icon name="shield" size={14} />Saved on this device for this {owner === "guest" ? "guest profile" : "account"} · not synced</p>

        <AnimatePresence initial={false}>
          {adding && (
            <motion.form key="form" className="k-word-form" onSubmit={save}
              initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease }} style={{ overflow: "hidden" }}>
              <div className="k-word-form-inner">
                <TextField id="family-word" label="The word or saying" value={word} onChange={(e) => setWord(e.target.value)} required maxLength={100} placeholder="A nickname, in any script" />
                <TextField id="family-meaning" label="What it means in our family" value={meaning} onChange={(e) => setMeaning(e.target.value)} required maxLength={300} placeholder="The feeling behind it" />
                <TextField id="family-who" label="Who says it? (optional)" value={who} onChange={(e) => setWho(e.target.value)} maxLength={60} placeholder="For example, my grandmother" />
                <Button type="submit" icon="heart">Keep this expression</Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        <AnimatePresence>{error && <Alert key="err">{error}</Alert>}</AnimatePresence>

        {words.length ? (
          <ul className="k-word-grid">
            <AnimatePresence initial={false}>
              {words.map((item, i) => (
                <motion.li key={item.id} layout className="k-word-tile" style={{ "--tint": i % 3 }}
                  initial={{ opacity: 0, scale: 0.85, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}>
                  <span className="k-word-text" dir="auto">{item.word}</span>
                  <p dir="auto">{item.meaning}</p>
                  {item.who && <span className="k-word-who"><Icon name="voice" size={13} />{item.who}</span>}
                  <button type="button" className="k-word-remove" aria-label={`Remove ${item.word}`} onClick={() => remove(item.id)}><Icon name="x" size={16} /></button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="k-word-empty">
            <span lang="ar" dir="rtl">كبدتي</span>
            <div><p className="k-h3">Every family has its own language</p><p className="k-small">Add your first expression. It stays yours.</p></div>
          </div>
        )}
      </section>
    </div>
  );
}
