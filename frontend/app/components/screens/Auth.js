"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandMark, Icon } from "../icons";
import { Alert, Button, IconButton, TextField, fadeUp, stagger, swapIn } from "../ui";
import { backend, TEST_BACKEND } from "../../lib/backend";

const COPY = {
  login: { title: "Welcome back", sub: "Your words. Your family. A little less distance." },
  register: { title: "Make yourself at home", sub: "Keep your language preferences and translated notes together." },
  reset: { title: "Let’s get you back in", sub: "Enter your email to request a password reset." },
  confirm: { title: "Let’s get you back in", sub: "Enter the reset code and choose a new password." },
};

export function Auth({ onDone, onGuest, onBack, onQuickStart }) {
  const [mode, setMode] = useState("login"), [name, setName] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState(""), [code, setCode] = useState(""), [testCode, setTestCode] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState(""), [showPassword, setShowPassword] = useState(false);
  const register = mode === "register", reset = mode === "reset", confirm = mode === "confirm";
  function change(next) { setMode(next); setError(""); setNotice(""); setPassword(""); setCode(""); setTestCode(null); }
  async function submit(event) {
    event.preventDefault(); if (busy) return; setBusy(true); setError(""); setNotice("");
    try {
      if (reset) { const response = await backend.requestReset({ email }); setTestCode(response.testCode); setNotice(response.message); setMode("confirm"); }
      else if (confirm) { await backend.confirmReset({ email, code, password }); setMode("login"); setPassword(""); setCode(""); setTestCode(null); setNotice("Password updated. Sign in with your new password."); }
      else await onDone(await backend[register ? "register" : "login"]({ name, email, password }));
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function useTestAccount() { if (busy) return; setBusy(true); setError(""); try { await onDone(await backend.login({ email: "family@kebdti.test", password: "FamilyDemo26!" })); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  const copy = COPY[mode];

  return (
    <motion.div className="k-screen k-auth" variants={stagger} initial="hidden" animate="show">
      <motion.div className="k-auth-top" variants={fadeUp}>
        <IconButton icon="arrowLeft" label="Back" variant="plain" onClick={reset || confirm ? () => change("login") : onBack} disabled={busy} />
        <span className="k-auth-mark"><BrandMark size={28} />Kebdti</span>
        <span style={{ width: 44 }} aria-hidden="true" />
      </motion.div>

      <motion.header className="k-screen-head" variants={fadeUp}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode} className="k-auth-head" {...swapIn}>
            <h1 className="k-h1">{copy.title}</h1>
            <p className="k-lead">{copy.sub}</p>
          </motion.div>
        </AnimatePresence>
      </motion.header>

      {TEST_BACKEND && (
        <motion.div className="k-auth-test" variants={fadeUp}>
          <Icon name="info" size={18} />
          <span><b>Test accounts only.</b> Use made-up details. Accounts reset when the test server restarts and no emails are sent.</span>
        </motion.div>
      )}

      <motion.form className="k-form" onSubmit={submit} variants={fadeUp} noValidate={false}>
        <AnimatePresence initial={false}>
          {register && (
            <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
              <TextField id="auth-name" label="Your name" autoComplete="given-name" required minLength={2} maxLength={40} value={name} onChange={(e) => setName(e.target.value)} disabled={busy} />
            </motion.div>
          )}
        </AnimatePresence>
        <TextField id="auth-email" label="Email address" type="email" autoComplete="email" required maxLength={180} placeholder="you@example.test" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy || confirm} />
        {confirm && <TextField id="auth-code" label="Reset code" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6}" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} disabled={busy} />}
        {!reset && (
          <TextField
            id="auth-password" label={confirm ? "New password" : "Password"} type={showPassword ? "text" : "password"}
            autoComplete={register || confirm ? "new-password" : "current-password"} required minLength={register || confirm ? 8 : 1} maxLength={128}
            value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy}
            hint={register ? "At least 8 characters. Choose a password you don’t use elsewhere." : undefined}
            trailing={<button type="button" className="k-field-trailing k-reveal-btn" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((v) => !v)}>{showPassword ? "Hide" : "Show"}</button>}
          />
        )}
        {mode === "login" && <button type="button" className="k-link k-auth-forgot" onClick={() => change("reset")} disabled={busy}>Forgot password?</button>}
        {testCode && (
          <motion.div className="k-reset-code" role="status" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
            <span>Your test reset code</span><strong className="k-tnum">{testCode}</strong><small>Valid for 10 minutes. No email was sent.</small>
          </motion.div>
        )}
        {notice && <p className="k-auth-notice" role="status"><Icon name="check" size={15} strokeWidth={2.4} />{notice}</p>}
        <AnimatePresence>{error && <Alert key={error}>{error}</Alert>}</AnimatePresence>
        <Button type="submit" block loading={busy} iconEnd="arrowRight">{register ? (TEST_BACKEND ? "Create test account" : "Create account") : reset ? "Request reset code" : confirm ? "Update password" : "Sign in"}</Button>
      </motion.form>

      {!reset && !confirm && (
        <motion.div className="k-auth-alt" variants={fadeUp}>
          <p className="k-small">{register ? "Already have an account?" : "New to Kebdti?"} <button type="button" className="k-link" onClick={() => change(register ? "login" : "register")} disabled={busy}>{register ? "Sign in" : "Create an account"}</button></p>
          <div className="k-divider"><span>or</span></div>
          {onQuickStart && <Button block icon="voice" disabled={busy} onClick={onQuickStart}>Skip and start translating</Button>}
          {TEST_BACKEND && <Button block variant="secondary" icon="user" disabled={busy} onClick={useTestAccount}>Try the test account</Button>}
          <Button block variant="ghost" disabled={busy} onClick={async () => { if (busy) return; setBusy(true); try { await onGuest(); } finally { setBusy(false); } }}>Continue without an account</Button>
          <p className="k-small k-center-text">Guest profiles stay on this device. You can sign in later from Profile.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
