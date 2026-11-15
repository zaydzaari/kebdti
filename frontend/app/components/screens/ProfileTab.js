"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "../icons";
import { Flag } from "../flags";
import { Avatar, Button, Counter, LanguageSheet, Segmented, Switch } from "../ui";
import { LANG, safePair } from "../../lib/languages";
import { FamilySection } from "../FamilySection";
import { LIVE_TRANSLATE } from "../../lib/backend";
import { readFamilyWords } from "../../lib/family";
import { getThemePref, setThemePref } from "../../lib/store";

const ROLE_LABEL = { grandparent: "Grandparent", grandchild: "Grandchild", family: "Family member" };
const THEMES = [
  { value: "system", label: "Auto", icon: "sparkles" },
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
];

function Row({ icon, flag, label, sub, value, onClick, children, ariaLabel, disabled }) {
  const body = (
    <>
      {flag ? <span className="k-row-flag"><Flag code={flag} size={40} /></span> : icon && <span className="k-row-icon"><Icon name={icon} size={18} /></span>}
      <span className="k-row-main"><span className="k-row-label">{label}</span>{sub && <span className="k-row-sub">{sub}</span>}</span>
      {value && <span className="k-row-value">{value}</span>}
      {children}
      {onClick && <Icon name="chevronRight" size={18} className="k-row-chev" />}
    </>
  );
  return onClick
    ? <button type="button" className="k-row k-row-btn" onClick={onClick} aria-label={ariaLabel} disabled={disabled}>{body}</button>
    : <div className="k-row">{body}</div>;
}

function Group({ title, children, i = 0 }) {
  return (
    <section className="k-group" style={{ "--i": i }}>
      <h2 className="k-group-title">{title}</h2>
      <div className="k-group-box">{children}</div>
    </section>
  );
}

export function ProfileTab({ onToast, onHistory, profile, historyCount, onUpdate, onEdit, onReplayIntro, onDeleteAll, user, testBackend, scenario, onScenario, pending, onSignIn, onSignOut }) {
  const [picking, setPicking] = useState(null); // "lang" | "familyLang" | null
  const [theme, setTheme] = useState("system");
  const [armed, setArmed] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const armTimer = useRef(null);
  const close = useCallback(() => setPicking(null), []);

  useEffect(() => {
    setTheme(getThemePref());
    setWordCount(readFamilyWords(user?.id || "guest").length);
    return () => clearTimeout(armTimer.current);
  }, [user?.id]);

  function pick(code) {
    const p = picking === "lang"
      ? safePair(code, code === profile.familyLang ? profile.lang : profile.familyLang)
      : safePair(code === profile.lang ? profile.familyLang : profile.lang, code);
    onUpdate({ lang: p.from, familyLang: p.to });
    setPicking(null);
  }
  function chooseTheme(t) { setTheme(t); setThemePref(t); }
  function deleteAll() {
    if (!armed) { setArmed(true); armTimer.current = setTimeout(() => setArmed(false), 4000); return; }
    clearTimeout(armTimer.current); onDeleteAll();
  }

  return (
    <div className="k-screen k-profile">
      <header className="k-profile-card">
        <div className="k-profile-id">
          <Avatar name={profile.name} size={72} />
          <div>
            <h1 className="k-h1">{profile.name}</h1>
            <p className="k-small">{ROLE_LABEL[profile.role] || "Family member"} · speaks {LANG[profile.lang].label}</p>
          </div>
        </div>
        <div className="k-stats">
          <div><b className="k-display"><Counter value={historyCount} /></b><span>{historyCount === 1 ? "note" : "notes"} translated</span></div>
          <div><b className="k-display"><Counter value={wordCount} /></b><span>family {wordCount === 1 ? "word" : "words"}</span></div>
          <div className="k-stat-pair"><b className="k-stat-flags" aria-label={`${LANG[profile.lang].label} and ${LANG[profile.familyLang].label}`}><Flag code={profile.lang} size={34} /><Flag code={profile.familyLang} size={34} /></b><span>your languages</span></div>
        </div>
      </header>

      <Group title="Account" i={0}>
        <Row icon="user" label={user ? user.email : "Guest on this device"} sub={user ? (testBackend ? "Test account · session and notes use the test backend." : "Your profile and notes are connected to your account.") : "Your profile and notes are saved only in this browser."} />
        <Row label={user ? "Sign out" : "Sign in or create an account"} onClick={user ? onSignOut : onSignIn} disabled={pending} />
      </Group>

      {testBackend && (
        <Group title="Preview scenarios" i={1}>
          <label className="k-row k-row--select">
            <span className="k-row-icon"><Icon name="sparkles" size={18} /></span>
            <span className="k-row-main"><span className="k-row-label">Next test translation</span><span className="k-row-sub">Choose a state, then try a new sample in Translate.</span></span>
            <select className="k-select-native" aria-label="Test translation scenario" value={scenario} onChange={(e) => onScenario(e.target.value)}>
              <option value="success">Success</option><option value="unclear">Unclear audio</option><option value="offline">Service unavailable</option>
            </select>
          </label>
        </Group>
      )}

      <Group title="Languages" i={2}>
        <Row flag={profile.lang} label="You speak" value={LANG[profile.lang].label} onClick={() => setPicking("lang")} />
        <Row flag={profile.familyLang} label="Your family speaks" value={LANG[profile.familyLang].label} onClick={() => setPicking("familyLang")} />
      </Group>

      <Group title="Voice" i={3}>
        <Row icon="voice" label="Allow voice copying" sub="When on, your family hears your messages in your own voice. Set it up once on the Translate tab: talk for 15 to 30 seconds.">
          <Switch checked={!!profile.voiceConsent} onChange={(v) => onUpdate({ voiceConsent: v })} label="Allow voice copying" />
        </Row>
      </Group>

      {LIVE_TRANSLATE && <FamilySection onToast={onToast} />}

      <Group title="Appearance" i={4}>
        <div className="k-row k-row--stack">
          <span className="k-row-main"><span className="k-row-label">Theme</span></span>
          <Segmented options={THEMES} value={theme} onChange={chooseTheme} label="Theme" />
        </div>
      </Group>

      <Group title="Your space" i={5}>
        <a className="k-row k-row-btn" href="/grandma" target="kebdti-grandma" rel="noopener"><span className="k-row-icon"><Icon name="voice" size={18} /></span><span className="k-row-main"><span className="k-row-label">Grandparent’s phone</span><span className="k-row-sub">One big button to record. Messages arrive as voice notes in Darija.</span></span><Icon name="chevronRight" size={18} className="k-row-chev" /></a>
        <Row icon="clock" label="History" sub={`${historyCount} saved translations`} onClick={onHistory} ariaLabel="History" />
        <Row icon="user" label="Edit name and role" onClick={onEdit} />
        <Row icon="replay" label="Replay the introduction" onClick={onReplayIntro} />
        <Row icon="info" label="Kebdti 0.1" sub={`Veritas AI Hackathon 2026 · AI + Languages track. ${testBackend ? "Test backend connected. Sample translations only." : "Live translation: speech recognition, GPT-6 Luna and family voices."}`} />
      </Group>

      <section className="k-group k-danger" style={{ "--i": 6 }}>
        <Button variant="danger" block icon="trash" className={armed ? "is-armed" : ""} onClick={deleteAll}>{armed ? "Tap again to delete everything" : "Delete my profile and history"}</Button>
        <p className="k-small">Removes your profile and {historyCount} saved {historyCount === 1 ? "note" : "notes"} and your on-device family expressions {user ? (testBackend ? "from your test account" : "from your account") : "from this device"}. This can’t be undone.</p>
      </section>

      <LanguageSheet open={!!picking} title={picking === "lang" ? "You speak" : "Your family speaks"} value={picking === "lang" ? profile.lang : profile.familyLang} onPick={pick} onClose={close} />
    </div>
  );
}
