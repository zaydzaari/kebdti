"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Alert, Button, TABS, TabBar, Toast } from "./components/ui";
import { BrandMark } from "./components/icons";
import { Splash } from "./components/screens/Splash";
import { Onboarding } from "./components/screens/Onboarding";
import { Auth } from "./components/screens/Auth";
import { Setup } from "./components/screens/Setup";
import { Consent } from "./components/screens/Consent";
import { TranslateTab } from "./components/screens/TranslateTab";
import { HistoryTab } from "./components/screens/HistoryTab";
import { PhrasesTab } from "./components/screens/PhrasesTab";
import { FamilyTab } from "./components/screens/FamilyTab";
import { clearFamilyWords } from "./lib/family";
import { ProfileTab } from "./components/screens/ProfileTab";
import { GrandmaScreen } from "./components/screens/GrandmaScreen";
import { addHistory, clearAll, loadHistory, loadProfile, removeHistory, saveLangs, saveProfile } from "./lib/store";
import { backend, TEST_BACKEND, SAMPLE_MODE } from "./lib/backend";
import { LANG } from "./lib/languages";
import { useRipple, useScrollReveal, useTilt } from "./components/effects";

const DEMO_PROFILE = { name: "Mi Fatna", role: "grandparent", lang: "dar", familyLang: "en", voiceConsent: false };
const ease = [0.22, 1, 0.36, 1];
// Entry screens rise and settle; tabs slide in the direction you moved.
const entryMotion = {
  initial: { opacity: 0, y: 24, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.16 } },
};
const tabMotion = {
  initial: (dir) => ({ opacity: 0, x: dir * 28 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.42, ease } },
  exit: (dir) => ({ opacity: 0, x: dir * -16, transition: { duration: 0.14 } }),
};
const ORDER = [...TABS.map((t) => t.id), "history"];
const validProfile = (p) => p && typeof p.name === "string" && p.name.trim() && LANG[p.lang] && LANG[p.familyLang] && p.lang !== p.familyLang;

export default function Home() {
  useRipple(); useScrollReveal(); useTilt();
  const [stage, setStage] = useState("splash"), [entry, setEntry] = useState(null), [splashDone, setSplashDone] = useState(false);
  const [profile, setProfile] = useState(null), [user, setUser] = useState(null), [draft, setDraft] = useState(null), [tab, setTabState] = useState("translate"), [history, setHistory] = useState([]), [demo, setDemo] = useState(false), [returnToApp, setReturnToApp] = useState(false), [pending, setPending] = useState(false), [connectionError, setConnectionError] = useState(""), [scenario, setScenario] = useState("success"), [conversationPrompt, setConversationPrompt] = useState(null);
  const [toast, setToast] = useState({ msg: "", icon: "check" }), toastTimer = useRef(null), profileRef = useRef(null), saveQueue = useRef(Promise.resolve()), identity = useRef("guest");
  const [dir, setDir] = useState(1);
  const [familyView, setFamilyView] = useState(false);
  identity.current = user?.id || "guest"; profileRef.current = profile;

  const setTab = useCallback((next) => {
    setTabState((prev) => { setDir(ORDER.indexOf(next) >= ORDER.indexOf(prev) ? 1 : -1); return next; });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);
  const showToast = useCallback((msg, icon = "check") => { setToast({ msg, icon }); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast({ msg: "", icon }), 3200); }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  function adoptProfile(value) { profileRef.current = value; setProfile(value); }
  async function restore() {
    setConnectionError("");
    try {
      if (new URLSearchParams(window.location.search).get("demo") === "1") { setDemo(true); adoptProfile(DEMO_PROFILE); setEntry("app"); return; }
      const session = await backend.session(); setUser(session.user);
      if (session.user) { adoptProfile(validProfile(session.profile) ? session.profile : null); setHistory((await backend.notes()).notes); setEntry(validProfile(session.profile) ? "app" : "setup"); }
      else { const saved = loadProfile(); adoptProfile(validProfile(saved) ? saved : null); setHistory(validProfile(saved) ? loadHistory() : []); setEntry(validProfile(saved) ? "app" : "onboarding"); }
    } catch (error) { setConnectionError(error.message); setEntry("connection"); }
  }
  useEffect(() => { restore(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (splashDone && entry) setStage(entry); }, [splashDone, entry]);
  async function guest() { try { await backend.logout(); } catch {} setDraft(null); setConversationPrompt(null); setUser(null); const saved = loadProfile(); adoptProfile(validProfile(saved) ? saved : null); setHistory(validProfile(saved) ? loadHistory() : []); setReturnToApp(false); setStage(validProfile(saved) ? "app" : "setup"); }
  async function signedIn(session) { setDraft(null); setConversationPrompt(null); const notes = await backend.notes(); setUser(session.user); adoptProfile(validProfile(session.profile) ? session.profile : null); setHistory(notes.notes); setReturnToApp(false); setTab("translate"); setStage(validProfile(session.profile) ? "app" : "setup"); }
  // Straight into the app: reuse this device's guest profile, or a ready family (grandchild in English <-> grandma in Darija).
  function quickStart() { const saved = loadProfile(); const next = validProfile(saved) ? saved : { name: "Yanis", role: "grandchild", lang: "en", familyLang: "dar", voiceConsent: false, createdAt: Date.now() }; if (!validProfile(saved)) { saveProfile(next); saveLangs(next.lang, next.familyLang); } setDraft(null); setConversationPrompt(null); setUser(null); adoptProfile(next); setHistory(loadHistory()); setReturnToApp(false); setTab("translate"); setStage("app"); showToast(`Welcome, ${next.name}`); }
  function finishOnboarding() { if (returnToApp) { setReturnToApp(false); setStage("app"); } else setStage("auth"); }
  async function persistProfile(value) { if (user) { const result = await backend.saveProfile(value); return result.profile; } if (!demo) { saveProfile(value); saveLangs(value.lang, value.familyLang); } return value; }
  async function finishSetup(data) { if (pending) return; if (returnToApp && profile) { setPending(true); try { const next = await persistProfile({ ...profile, ...data }); adoptProfile(next); setReturnToApp(false); setStage("app"); showToast("Profile saved"); } catch (e) { showToast(e.message, "alert"); } finally { setPending(false); } return; } setDraft(data); setStage("consent"); }
  async function finishConsent(voiceConsent) { if (pending) return; setPending(true); try { const next = await persistProfile({ ...draft, voiceConsent, createdAt: Date.now() }); adoptProfile(next); setTab("translate"); setStage("app"); } catch (e) { showToast(e.message, "alert"); } finally { setPending(false); } }
  function updateProfile(patch) { const previous = profileRef.current, next = { ...previous, ...patch }, owner = identity.current; adoptProfile(next); saveQueue.current = saveQueue.current.catch(() => {}).then(() => (identity.current === owner ? persistProfile(next) : null)).catch((e) => { if (identity.current === owner && profileRef.current === next) adoptProfile(previous); showToast(e.message, "alert"); }); }
  async function saveToHistory(note) { if (demo) return false; const owner = user?.id || "guest"; if (identity.current !== owner) return false; try { const items = user ? (await backend.addNote(note)).notes : addHistory(note); if (identity.current !== owner) return false; setHistory(items); return true; } catch (e) { if (identity.current === owner) showToast(`Translation ready. History was not saved: ${e.message}`, "alert"); return false; } }
  async function deleteFromHistory(id) { const owner = identity.current; try { const items = user ? (await backend.removeNote(id)).notes : removeHistory(id); if (identity.current !== owner) return; setHistory(items); showToast("Note deleted", "trash"); } catch (e) { showToast(e.message, "alert"); } }
  async function deleteEverything() { const owner = identity.current; try { if (user) await backend.clearData(); else clearAll(); clearFamilyWords(owner); if (identity.current !== owner) return; setConversationPrompt(null); adoptProfile(null); setHistory([]); setTab("translate"); setReturnToApp(false); setStage("onboarding"); } catch (e) { showToast(e.message, "alert"); } }
  async function signOut() { if (pending) return; setPending(true); try { await backend.logout(); setDraft(null); setConversationPrompt(null); setUser(null); adoptProfile(null); setHistory([]); setStage("auth"); showToast("Signed out"); } catch (e) { showToast(e.message, "alert"); } finally { setPending(false); } }
  function startConversation(item) { setConversationPrompt({ ...item, requestId: Date.now() }); setTab("translate"); }

  const entryScreen = (key, children) => <motion.div key={key} className="k-tabhost k-tabhost--motion" {...entryMotion}>{children}</motion.div>;
  const tabScreen = (key, children) => <motion.div key={key} className="k-tabhost k-tabhost--motion" custom={dir} variants={tabMotion} initial="initial" animate="animate" exit="exit">{children}</motion.div>;
  const inApp = stage === "app" && profile;
  const grandmaPhone = inApp && profile.role === "grandparent" && !demo && !familyView;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!splashDone && <Splash key="splash" onDone={() => setSplashDone(true)} />}</AnimatePresence>
      <main className={`k-app ${inApp ? "k-app--work" : "k-app--entry"}`}>
        {!inApp && stage !== "splash" && (
          <aside className="k-entry-scene" aria-hidden="true">
            <div className="k-entry-brand"><BrandMark size={40} /><span>Kebdti</span><small lang="ar" dir="rtl">كبدتي</small></div>
            <div className="k-entry-story">
              <p className="k-entry-kicker">Across languages. Close at heart.</p>
              <h2 className="k-display">Her words.<br />The whole feeling.</h2>
              <img src="/illustrations/family-clay.webp" width="640" height="400" alt="" />
              <p className="k-lead">For all the things a word-for-word translation leaves behind.</p>
            </div>
          </aside>
        )}
        <div className="k-main">
          {SAMPLE_MODE && splashDone && <div className="k-test-ribbon"><i />Test backend · sample translations</div>}
          {stage === "splash" && splashDone && (
            <div className="k-screen k-center" role="status"><span className="k-loading-mark"><BrandMark size={56} /></span><h1 className="k-h2">Getting your space ready</h1><p className="k-small">Restoring your profile and saved notes</p></div>
          )}
          <AnimatePresence mode="wait">
            {stage === "connection" && entryScreen("connection", (
              <div className="k-screen k-center k-narrow">
                <img className="k-empty-art" src="/illustrations/letter.svg" alt="" width="180" height="135" />
                <h1 className="k-h1">Let’s reconnect</h1>
                <Alert>{connectionError || "The service is unavailable."}</Alert>
                <Button block onClick={() => { setEntry(null); setStage("splash"); restore(); }}>Try again</Button>
                <Button block variant="secondary" onClick={guest}>Continue on this device</Button>
              </div>
            ))}
            {stage === "onboarding" && entryScreen("onboarding", <Onboarding onDone={finishOnboarding} finishLabel={returnToApp ? "Back to Kebdti" : "Get started"} />)}
            {stage === "auth" && entryScreen("auth", <Auth onDone={signedIn} onGuest={guest} onQuickStart={quickStart} onBack={() => setStage(profile ? "app" : "onboarding")} />)}
            {stage === "setup" && entryScreen("setup", <Setup initial={returnToApp ? profile : draft || { name: user?.name || "" }} saving={pending} editing={returnToApp} onDone={finishSetup} onBack={() => { if (returnToApp) { setReturnToApp(false); setStage("app"); } else setStage("auth"); }} />)}
            {stage === "consent" && entryScreen("consent", <Consent name={draft?.name} saving={pending} onDone={finishConsent} onBack={() => setStage("setup")} />)}
          </AnimatePresence>
          {grandmaPhone && <GrandmaScreen profile={profile} onFamilyView={() => setFamilyView(true)} />}
          {inApp && !grandmaPhone && (
            <>
              <div className="k-tabhost" hidden={tab !== "translate"}>
                <TranslateTab key={user?.id || "guest"} profile={profile} demo={demo} testScenario={scenario} active={tab === "translate"} conversationPrompt={conversationPrompt} onStartConversation={startConversation} onGoPhrases={() => setTab("phrases")} onSaved={saveToHistory} onToast={showToast} />
              </div>
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                {tab === "family" && tabScreen("family", <FamilyTab key={user?.id || "guest"} owner={user?.id || "guest"} onStart={startConversation} onToast={showToast} />)}
                {tab === "history" && tabScreen("history", <HistoryTab items={history} account={!!user} onDelete={deleteFromHistory} onGoTranslate={() => setTab("translate")} onBack={() => setTab("profile")} />)}
                {tab === "phrases" && tabScreen("phrases", <PhrasesTab onToast={showToast} lang={profile?.lang} />)}
                {tab === "profile" && tabScreen("profile", <ProfileTab onToast={showToast} onHistory={() => setTab("history")} profile={profile} user={user} testBackend={SAMPLE_MODE} scenario={scenario} onScenario={setScenario} pending={pending} onSignIn={() => setStage("auth")} onSignOut={signOut} historyCount={history.length} onUpdate={updateProfile} onEdit={() => { setReturnToApp(true); setStage("setup"); }} onReplayIntro={() => { setReturnToApp(true); setStage("onboarding"); }} onDeleteAll={deleteEverything} />)}
              </AnimatePresence>
              <TabBar tab={tab === "history" ? "profile" : tab} onTab={setTab} />
            </>
          )}
        </div>
      </main>
      <Toast message={toast.msg} icon={toast.icon} />
    </MotionConfig>
  );
}
