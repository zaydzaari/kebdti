"use client";

import { useCallback, useState } from "react";
import { safePair } from "../../lib/languages";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../icons";
import { Button, Choice, IconButton, LanguageSheet, SelectRow, Steps, TextField } from "../ui";
import { LANG } from "../../lib/languages";

const ROLES = [
  { value: "grandparent", label: "Grandparent", icon: "heart", sub: "Your grandchildren speak another language" },
  { value: "grandchild", label: "Grandchild", icon: "user", sub: "Your grandparents speak another language" },
  { value: "family", label: "Other family", icon: "languages", sub: "Parents, aunts, cousins and everyone else" },
];

// Sensible language defaults for each role, until the person picks their own.
const ROLE_LANGS = {
  grandparent: { lang: "dar", familyLang: "en" },
  grandchild: { lang: "en", familyLang: "dar" },
};

const ease = [0.22, 1, 0.36, 1];
const STEPS = [
  { title: "What should we call you?", sub: "Kebdti uses your name to greet you and to sign the notes you send." },
  { title: "Who are you in the family?", sub: "This sets sensible languages. You can change them next." },
  { title: "Which languages?", sub: "Kebdti translates between these two, both ways." },
];

export function Setup({ initial, onDone, onBack, editing = false, saving = false }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState(initial?.name || "");
  const [role, setRole] = useState(initial?.role || "grandchild");
  const [lang, setLang] = useState(initial?.lang || "en");
  const [familyLang, setFamilyLang] = useState(initial?.familyLang || "dar");
  const [touched, setTouched] = useState(!!initial?.lang);
  const [error, setError] = useState("");
  const [picking, setPicking] = useState(null); // "lang" | "familyLang" | null
  const close = useCallback(() => setPicking(null), []);

  function chooseRole(r) {
    setRole(r);
    if (!touched && ROLE_LANGS[r]) { setLang(ROLE_LANGS[r].lang); setFamilyLang(ROLE_LANGS[r].familyLang); }
  }
  function pick(code) {
    setTouched(true);
    const p = picking === "lang" ? safePair(code, code === familyLang ? lang : familyLang) : safePair(code === lang ? familyLang : lang, code);
    setLang(p.from); setFamilyLang(p.to);
    setPicking(null);
  }
  function go(next) { setDir(next > step ? 1 : -1); setStep(next); }
  function submit(event) {
    event.preventDefault();
    if (step === 0) {
      if (!name.trim()) { setError("Enter your name to continue."); return; }
      go(1); return;
    }
    if (step === 1) { go(2); return; }
    onDone({ name: name.trim().slice(0, 40), role, lang, familyLang });
  }
  const copy = STEPS[step];

  return (
    <form className="k-screen k-setup" onSubmit={submit} noValidate>
      <div className="k-setup-top">
        <IconButton icon="arrowLeft" label="Back" variant="plain" onClick={() => (step ? go(step - 1) : onBack?.())} />
        <Steps count={3} current={step} label={`Step ${step + 1} of 3`} />
        <span style={{ width: 44 }} aria-hidden="true" />
      </div>
      <p className="k-eyebrow">{editing ? "Edit your profile" : "Create your profile"}</p>

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={step}
          className="k-setup-step"
          custom={dir}
          variants={{ enter: (d) => ({ opacity: 0, x: d * 40 }), center: { opacity: 1, x: 0 }, leave: (d) => ({ opacity: 0, x: d * -40 }) }}
          initial="enter" animate="center" exit="leave" transition={{ duration: 0.36, ease }}
        >
          <header className="k-screen-head">
            <h1 className="k-h1">{copy.title}</h1>
            <p className="k-lead">{copy.sub}</p>
          </header>

          {step === 0 && (
            <div className="k-setup-name">
              <TextField id="name" label="Your name" placeholder="e.g. Yanis" autoComplete="given-name" value={name} maxLength={40} error={error} autoFocus
                onChange={(e) => { setName(e.target.value); if (error) setError(""); }} />
              <AnimatePresence>
                {name.trim() && (
                  <motion.p className="k-setup-hello" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <span lang="ar" dir="rtl">مرحبا</span> {name.trim()}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}

          {step === 1 && (
            <div className="k-choices" role="radiogroup" aria-label="Your role in the family">
              {ROLES.map((r, i) => (
                <motion.div key={r.value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4, ease }}>
                  <Choice on={role === r.value} icon={r.icon} title={r.label} sub={r.sub} onSelect={() => chooseRole(r.value)} />
                </motion.div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="k-setup-langs">
              <SelectRow label="You speak" code={lang} onClick={() => setPicking("lang")} />
              <div className="k-setup-link" aria-hidden="true"><span /><Icon name="swap" size={16} /><span /></div>
              <SelectRow label="Your family speaks" code={familyLang} onClick={() => setPicking("familyLang")} />
              <p className="k-setup-preview k-small">You’ll speak <b>{LANG[lang].hint}</b> and they’ll read it in <b>{LANG[familyLang].hint}</b>, and the other way round.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="k-setup-foot">
        <Button block type="submit" loading={saving} iconEnd={step < 2 ? "arrowRight" : editing ? "check" : "arrowRight"}>
          {step === 2 && editing ? (saving ? "Saving…" : "Save changes") : "Continue"}
        </Button>
      </div>

      <LanguageSheet open={!!picking} title={picking === "lang" ? "You speak" : "Your family speaks"} value={picking === "lang" ? lang : familyLang} onPick={pick} onClose={close} />
    </form>
  );
}
