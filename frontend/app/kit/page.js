"use client";

// Design review page: every Kebdti element in every state, in one place. Not linked from the app.
import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { BrandMark } from "../components/icons";
import { Alert, Avatar, Button, Card, Chip, Choice, Counter, Dots, EmptyState, IconButton, LanguageSheet, LanguageSwitch, Segmented, SelectRow, Skeleton, Steps, Switch, Tag, TextField, ThemeToggle, Toast } from "../components/ui";
import { AudioPill, IdleWave, RecordButton, ThinkingBars, TranslateSteps } from "../components/audio";
import { useRipple, useTilt } from "../components/effects";

const SWATCHES = ["paper", "paper-2", "card", "card-2", "ink", "ink-2", "ink-3", "terra", "terra-ink", "terra-soft", "olive", "olive-ink", "olive-soft", "btn"];

export default function Kit() {
  useRipple(); useTilt();
  const [seg, setSeg] = useState("system");
  const [sw, setSw] = useState(true);
  const [choice, setChoice] = useState("no");
  const [chip, setChip] = useState("all");
  const [rec, setRec] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState("");
  const [pair, setPair] = useState(["dar", "fr"]);
  const [count, setCount] = useState(12);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2200); };

  return (
    <MotionConfig reducedMotion="user">
      <main className="k-app">
        <div className="k-screen k-kit">
          <header className="k-kit-head">
            <div className="k-kit-brand"><BrandMark size={44} /><div><h1 className="k-h1">Kebdti kit</h1><p className="k-lead">Every element, every state. A family letter that talks.</p></div></div>
            <ThemeToggle />
          </header>

          <section className="k-kit-sec"><h2 className="k-h2">Colour</h2>
            <div className="k-kit-swatches">{SWATCHES.map((s) => <div key={s}><span style={{ background: `var(--k-${s})` }} /><small>{s}</small></div>)}</div>
          </section>

          <section className="k-kit-sec"><h2 className="k-h2">Type</h2>
            <p className="k-display" style={{ fontSize: 44 }}>She says kebdti</p>
            <p className="k-h1">Record a voice note</p><p className="k-h2">Why it&apos;s said this way</p><p className="k-h3">Open a voice note you received</p>
            <p className="k-lead">Speak in Darija. Kebdti writes what you mean in French.</p><p className="k-body">In Darija, deep love lives in the liver, not the heart.</p><p className="k-small">Saved on this device</p>
            <p lang="ar" dir="rtl" style={{ fontSize: 34 }}>كبدتي، توحشتك بزاف</p>
          </section>

          <section className="k-kit-sec"><h2 className="k-h2">Buttons</h2>
            <div className="k-kit-row"><Button icon="message" className="k-btn--shine">Send on WhatsApp</Button><Button variant="accent" icon="mic">Record</Button><Button variant="secondary" icon="rotate">Record again</Button><Button variant="ghost">Cancel</Button><Button variant="danger" icon="trash">Delete</Button></div>
            <div className="k-kit-row"><Button size="sm" iconEnd="arrowRight">Next</Button><Button loading>Saving</Button><Button disabled>Disabled</Button><Button variant="secondary" size="sm" onClick={() => flash("Copied")}>Show a toast</Button></div>
            <div className="k-kit-row"><IconButton icon="moon" label="Theme" /><IconButton icon="share" label="Share" variant="ink" /><IconButton icon="x" label="Close" variant="plain" /><IconButton icon="trash" label="Delete" shape="square" /></div>
          </section>

          <section className="k-kit-sec"><h2 className="k-h2">Chips, tags, alerts</h2>
            <div className="k-kit-row">{["all", "love", "blessing"].map((c) => <Chip key={c} on={chip === c} count={c === "all" ? 15 : 4} onClick={() => setChip(c)}>{c === "all" ? "All" : c === "love" ? "Love" : "Blessings"}</Chip>)}</div>
            <div className="k-kit-row"><Tag>Sample</Tag><Tag tone="terra">affection</Tag><Tag tone="olive">In French</Tag><Tag tone="card" icon="shield">On this device</Tag></div>
            <Alert>Kebdti couldn&apos;t hear that clearly. Please record it again.</Alert>
            <Alert tone="info">Test mode uses an authored example.</Alert>
          </section>

          <section className="k-kit-sec"><h2 className="k-h2">Fields and pickers</h2>
            <div className="k-kit-grid">
              <TextField id="kit-a" label="Your name" placeholder="e.g. Yanis" />
              <TextField id="kit-b" label="Email address" defaultValue="lina@example.test" />
              <TextField id="kit-c" label="Password" type="password" error="Use at least 8 characters." />
              <SelectRow label="You speak" code="dar" onClick={() => setSheet(true)} />
            </div>
            <Segmented label="Theme" value={seg} onChange={setSeg} options={[{ value: "system", label: "Auto" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
            <div className="k-kit-row"><Switch checked={sw} onChange={setSw} label="Allow voice copying" /><Switch checked={!sw} onChange={(v) => setSw(!v)} label="Second switch" /></div>
            <div className="k-choices" role="radiogroup" aria-label="Voice">
              <Choice on={choice === "yes"} icon="voice" title="Yes, use my voice" sub="Your family hears translations in a voice like yours." onSelect={() => setChoice("yes")} />
              <Choice on={choice === "no"} icon="shield" title="No, use a neutral voice" sub="Translations are read by a standard voice." onSelect={() => setChoice("no")} />
            </div>
            <LanguageSwitch from={pair[0]} to={pair[1]} onSwap={() => setPair(([a, b]) => [b, a])} onPick={() => setSheet(true)} />
          </section>

          <section className="k-kit-sec"><h2 className="k-h2">Voice</h2>
            <div className="k-kit-row k-kit-orbs">
              <div><RecordButton recording={rec} onClick={() => setRec((r) => !r)} /><small>Tap: idle / recording</small></div>
              <div><RecordButton disabled size="md" /><small>Waiting for the mic</small></div>
              <div><RecordButton size="sm" /><small>Small</small></div>
            </div>
            <div className="k-kit-row"><IdleWave /><ThinkingBars /><Dots /></div>
            <div className="k-kit-col">
              <AudioPill side="in" duration={6} label="Mi Fatna · voice note" tone="saffron" seed={3} disabled onUnavailable={() => flash("No recording here")} />
              <AudioPill side="out" speak={{ text: "Mon cœur, quand viens-tu me voir ?", lang: "fr-FR" }} label="Read aloud" tone="olive" seed={11} />
            </div>
            <Card><TranslateSteps steps={[{ icon: "ear", label: "Listening to the Darija" }, { icon: "heart", label: "Working out what it means" }, { icon: "languages", label: "Writing it in French" }]} /></Card>
            <Card><Skeleton lines={4} /></Card>
          </section>

          <section className="k-kit-sec"><h2 className="k-h2">People and numbers</h2>
            <div className="k-kit-row"><Avatar name="Yanis" size={64} /><Avatar name="Fatna" /><span className="k-display" style={{ fontSize: 44 }}><Counter value={count} /></span><Button size="sm" variant="secondary" onClick={() => setCount((c) => c + 7)}>Add 7</Button></div>
            <Steps count={3} current={1} />
            <Card className="k-tilt" tone="terra"><p className="k-h2">Hover me</p><p className="k-body">Cards marked as tilt lean toward the pointer.</p></Card>
          </section>

          <section className="k-kit-sec"><h2 className="k-h2">Empty state</h2>
            <Card><EmptyState title="No voice notes yet" body="Every note you translate is saved here, so you can listen again." action={<Button icon="mic">Record a voice note</Button>} /></Card>
          </section>
        </div>
        <LanguageSheet open={sheet} title="You speak" value={pair[0]} onPick={(c) => { setPair(([a, b]) => [c, c === b ? a : b]); setSheet(false); }} onClose={() => setSheet(false)} />
        <Toast message={toast} />
      </main>
    </MotionConfig>
  );
}
