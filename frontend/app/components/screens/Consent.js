"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "../icons";
import { Button, Choice, IconButton, fadeUp, stagger } from "../ui";

const OPTIONS = [
  { value: true, icon: "voice", title: "Yes, use my voice", sub: "Your family hears translations in a voice that sounds like yours. Only people you send notes to." },
  { value: false, icon: "shield", title: "No, use a neutral voice", sub: "Translations are read by a standard voice instead." },
];

// Two voices: yours, and the one your family would hear. The second takes your colour only with your yes.
function VoicePair({ yes }) {
  return (
    <div className={`k-consent-art${yes === true ? " is-yes" : yes === false ? " is-no" : ""}`} aria-hidden="true">
      <span className="k-consent-voice k-consent-voice--you"><Icon name="mic" size={22} /><i>You</i></span>
      <span className="k-consent-wave">{Array.from({ length: 9 }, (_, i) => <b key={i} style={{ "--n": i }} />)}</span>
      <span className="k-consent-voice k-consent-voice--them"><Icon name="volume" size={22} /><i>Family hears</i></span>
    </div>
  );
}

export function Consent({ name, onDone, onBack, saving = false }) {
  const [choice, setChoice] = useState(null);
  return (
    <motion.div className="k-screen k-consent" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}><IconButton icon="arrowLeft" label="Back" variant="plain" onClick={onBack} /></motion.div>
      <motion.header className="k-screen-head" variants={fadeUp}>
        <h1 className="k-h1">Can Kebdti copy your voice, {name}?</h1>
        <p className="k-lead">You decide. You can change your answer any time in Profile.</p>
      </motion.header>
      <motion.div variants={fadeUp}><VoicePair yes={choice} /></motion.div>
      <motion.div className="k-choices" variants={fadeUp} role="radiogroup" aria-label="Voice copying">
        {OPTIONS.map((o) => <Choice key={String(o.value)} on={choice === o.value} icon={o.icon} title={o.title} sub={o.sub} onSelect={() => setChoice(o.value)} />)}
      </motion.div>
      <motion.p className="k-small" variants={fadeUp}>With your yes, Kebdti learns your voice from a 15–30 second recording, so your family hears every translation in your own voice. Kept privately for your family. Change your answer any time in Profile.</motion.p>
      <motion.div className="k-setup-foot" variants={fadeUp}>
        <Button block disabled={choice === null} loading={saving} onClick={() => onDone(choice)} iconEnd="check">{saving ? "Saving your choice…" : "Finish setup"}</Button>
      </motion.div>
    </motion.div>
  );
}
