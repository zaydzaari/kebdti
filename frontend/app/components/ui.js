"use client";

// Kebdti UI kit. Every control in the app comes from here and is styled by app/styles/components.css.
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { BrandMark, Icon } from "./icons";
import { Flag } from "./flags";
import { LANG, LANGUAGES, LIVE_CODES } from "../lib/languages";
import { LIVE_TRANSLATE } from "../lib/backend";
import { getThemePref, isDarkNow, setThemePref } from "../lib/store";

// ---------- motion presets ----------
export const spring = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 };
export const softSpring = { type: "spring", stiffness: 260, damping: 30 };
export const ease = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16 } },
};
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};
export const swapIn = {
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.42, ease } },
  exit: { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.16 } },
};

// ---------- Button ----------
// variant: primary (ink pill) · accent (terracotta) · secondary (card) · ghost · danger
export function Button({ variant = "primary", size = "md", icon, iconEnd, block = false, loading = false, href, children, className = "", disabled, ...props }) {
  const cls = `k-btn k-btn--${variant} k-btn--${size}${block ? " k-btn--block" : ""}${loading ? " is-loading" : ""} ${className}`;
  const inner = (
    <>
      {icon && <Icon name={icon} size={size === "sm" ? 17 : 19} className="k-btn-icon" />}
      {children && <span className="k-btn-label">{children}</span>}
      {iconEnd && <Icon name={iconEnd} size={size === "sm" ? 17 : 19} className="k-btn-icon k-btn-icon--end" />}
      {loading && <Dots className="k-btn-dots" />}
    </>
  );
  if (href) return <a className={cls} href={href} {...props}>{inner}</a>;
  return <button type="button" className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{inner}</button>;
}

// ---------- IconButton ----------
// variant: card · ink · plain · soft (alias of card) · outline (alias of card)
export function IconButton({ icon, label, variant = "card", shape = "circle", size = 44, children, className = "", style, ...props }) {
  const v = variant === "soft" || variant === "outline" ? "card" : variant;
  return (
    <button
      type="button"
      className={`k-iconbtn k-iconbtn--${v}${shape === "square" ? " k-iconbtn--square" : ""} ${className}`}
      style={{ "--size": `${size}px`, ...style }}
      aria-label={label}
      title={label}
      {...props}
    >
      {children || <Icon name={icon} size={Math.round(size * 0.44)} />}
    </button>
  );
}

// ---------- Card ----------
export function Card({ as: Tag = "section", tone = "plain", className = "", children, ...props }) {
  return <Tag className={`k-card k-card--${tone} ${className}`} {...props}>{children}</Tag>;
}

// ---------- Tag (static) and Chip (toggle) ----------
export function Tag({ tone = "neutral", icon, children }) {
  return <span className={`k-tag k-tag--${tone}`}>{icon && <Icon name={icon} size={13} />}{children}</span>;
}
export function Chip({ on = false, count, children, ...props }) {
  return (
    <button type="button" className={`k-chip${on ? " is-on" : ""}`} aria-pressed={on} {...props}>
      <span>{children}</span>
      {count !== undefined && <span className="k-chip-count k-tnum">{count}</span>}
    </button>
  );
}

// ---------- Alert ----------
export function Alert({ tone = "error", children }) {
  return (
    <motion.div {...swapIn} className={`k-alert k-alert--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <span className="k-alert-icon"><Icon name={tone === "error" ? "alert" : "info"} size={18} /></span>
      <span className="k-alert-text">{children}</span>
    </motion.div>
  );
}

// ---------- Dots (inline loading) and Skeleton ----------
export function Dots({ className = "" }) {
  return <span className={`k-dots ${className}`} aria-hidden="true"><i /><i /><i /></span>;
}
export function Skeleton({ lines = 3, className = "" }) {
  return (
    <div className={`k-skeleton ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => <span key={i} style={{ "--w": `${[92, 74, 56, 80][i % 4]}%` }} />)}
    </div>
  );
}

// ---------- Avatar ----------
export function Avatar({ name = "", size = 44 }) {
  return <span className="k-avatar" style={{ "--size": `${size}px` }} aria-hidden="true">{(name.trim().charAt(0) || "K").toUpperCase()}</span>;
}

// ---------- Counter: ticks up to its value ----------
export function Counter({ value, className = "" }) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setShown(value); return; }
    const controls = animate(from.current, value, { duration: 0.9, ease, onUpdate: (v) => setShown(Math.round(v)) });
    from.current = value;
    return () => controls.stop();
  }, [value]);
  return <span className={`k-tnum ${className}`}>{shown}</span>;
}

// ---------- Steps: progress for a multi-step flow ----------
export function Steps({ count, current, label = "Progress" }) {
  return (
    <div className="k-steps" role="progressbar" aria-label={label} aria-valuemin={1} aria-valuemax={count} aria-valuenow={current + 1}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={i < current ? "is-done" : i === current ? "is-now" : ""}><i /></span>
      ))}
    </div>
  );
}

// ---------- Segmented control ----------
export function Segmented({ options, value, onChange, label }) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div className="k-seg" role="radiogroup" aria-label={label} style={{ "--n": options.length, "--i": index }}>
      <span className="k-seg-thumb" aria-hidden="true" />
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className={`k-seg-btn${o.value === value ? " is-on" : ""}`} onClick={() => onChange(o.value)}>
          {o.icon && <Icon name={o.icon} size={16} />}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

// ---------- Switch ----------
export function Switch({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={!!checked} aria-label={label} className={`k-switch${checked ? " is-on" : ""}`} onClick={() => onChange(!checked)}>
      <span className="k-switch-thumb"><Icon name="check" size={12} strokeWidth={3} /></span>
    </button>
  );
}

// ---------- TextField: floating label ----------
export function TextField({ id, label, error, hint, trailing, placeholder, ...props }) {
  return (
    <div className={`k-field${error ? " has-error" : ""}`}>
      <div className="k-field-box">
        <input id={id} className="k-input" placeholder={placeholder || " "} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} {...props} />
        <label className="k-field-label" htmlFor={id}>{label}</label>
        {trailing}
      </div>
      <AnimatePresence initial={false}>
        {error ? (
          <motion.span key="err" id={`${id}-err`} className="k-field-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Icon name="alert" size={14} />{error}
          </motion.span>
        ) : hint ? (
          <span key="hint" id={`${id}-hint`} className="k-field-hint">{hint}</span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ---------- SelectRow: opens a picker ----------
export function SelectRow({ label, code, onClick }) {
  return (
    <button type="button" className="k-select" onClick={onClick} aria-label={`${label}: ${LANG[code].label}. Change`}>
      <Flag code={code} size={44} className="k-flag-pop" key={code} />
      <span className="k-select-text">
        <span className="k-select-label">{label}</span>
        <span className="k-select-value">{LANG[code].label} <small>{LANG[code].english}</small></span>
      </span>
      <Icon name="chevron" size={18} className="k-select-chev" />
    </button>
  );
}

// ---------- Choice: a big radio card ----------
export function Choice({ on, icon, title, sub, onSelect, children }) {
  return (
    <button type="button" role="radio" aria-checked={!!on} className={`k-choice${on ? " is-on" : ""}`} onClick={onSelect}>
      {icon && <span className="k-choice-icon"><Icon name={icon} size={22} /></span>}
      <span className="k-choice-text">
        <span className="k-choice-title">{title}</span>
        {sub && <span className="k-choice-sub">{sub}</span>}
        {children}
      </span>
      <span className="k-choice-radio" aria-hidden="true"><i /></span>
    </button>
  );
}

// ---------- EmptyState ----------
export function EmptyState({ icon, art = "/illustrations/letter.svg", title, body, action }) {
  return (
    <motion.div className="k-empty" {...swapIn}>
      {art ? <img className="k-empty-art" src={art} alt="" width="200" height="150" /> : <span className="k-empty-icon"><Icon name={icon} size={28} /></span>}
      <h2 className="k-h2">{title}</h2>
      <p className="k-body">{body}</p>
      {action}
    </motion.div>
  );
}

// ---------- TabBar: floating dock on phones, side rail on desktop ----------
export const TABS = [
  { id: "translate", label: "Translate", icon: "mic" },
  { id: "family", label: "Between us", icon: "heart" },
  { id: "phrases", label: "Phrases", icon: "book" },
  { id: "profile", label: "Profile", icon: "user" },
];

export function TabBar({ tab, onTab }) {
  return (
    <nav className="k-dock" aria-label="Main">
      <div className="k-rail-brand"><BrandMark size={36} /><span>Kebdti<small lang="ar" dir="rtl">كبدتي</small></span></div>
      <div className="k-dock-links">
        {TABS.map((t) => {
          const on = t.id === tab;
          return (
            <button key={t.id} type="button" aria-label={t.label} className={`k-tab${on ? " is-on" : ""}`} onClick={() => onTab(t.id)} aria-current={on ? "page" : undefined}>
              {on && <motion.span layoutId="k-dock-pill" className="k-tab-pill" aria-hidden="true" transition={{ type: "spring", stiffness: 520, damping: 38 }} />}
              <span className="k-tab-icon"><Icon name={t.icon} size={22} filled={on && t.icon === "heart"} strokeWidth={on ? 2.1 : 1.8} /></span>
              <span className="k-tab-label">{t.label}</span>
            </button>
          );
        })}
      </div>
      <div className="k-rail-foot"><img src="/illustrations/letter.svg" alt="" width="104" height="78" /><p>A voice note is a little visit</p></div>
    </nav>
  );
}

// ---------- LanguageSwitch: two flags and a swap ----------
export function LanguageSwitch({ from, to, onSwap, onPick, disabled, fromLabel = "You speak" }) {
  const [turns, setTurns] = useState(0);
  const [how, setHow] = useState("pick"); // how the last change happened: "swap" or "pick"
  const enter = (role) => how === "swap"
    ? { x: role === "from" ? 84 : -84, rotate: role === "from" ? 200 : -200, scale: 0.8 }
    : { rotateY: -90, scale: 0.7 };
  const side = (code, role) => (
    <button
      type="button"
      className={`k-pair-side k-pair-side--${role}`}
      onClick={() => { setHow("pick"); onPick(role); }}
      disabled={disabled}
      aria-label={`${role === "from" ? fromLabel : "Translate into"} ${LANG[code].label}. Change language`}
      title={LANG[code].label}
    >
      <motion.span key={code} className="k-pair-flag" initial={enter(role)} animate={{ x: 0, rotate: 0, rotateY: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <Flag code={code} size={48} />
      </motion.span>
    </button>
  );
  return (
    <div className={`k-pair${disabled ? " is-disabled" : ""}`}>
      {side(from, "from")}
      <motion.button
        type="button"
        className="k-pair-swap"
        aria-label="Swap languages"
        title="Swap languages"
        disabled={disabled}
        whileTap={{ scale: 0.86 }}
        animate={{ rotate: turns * 180 }}
        transition={spring}
        onClick={() => { setHow("swap"); setTurns((t) => t + 1); onSwap(); }}
      >
        <Icon name="swap" size={18} strokeWidth={2.2} />
      </motion.button>
      {side(to, "to")}
    </div>
  );
}

// ---------- LanguageSheet: springs up, drag down to close ----------
export function LanguageSheet({ open, title, value, onPick, onClose }) {
  const y = useMotionValue(0);
  const fade = useTransform(y, [0, 320], [1, 0.2]);
  useEffect(() => {
    if (!open) return;
    y.set(0);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, y]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="sheet" className="k-sheet-layer" initial="hidden" animate="show" exit="hidden">
          <motion.div className="k-sheet-scrim" style={{ opacity: fade }} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} transition={{ duration: 0.22 }} onClick={onClose} />
          <motion.div
            className="k-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            style={{ y }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 600) onClose(); }}
            variants={{ hidden: { y: "105%" }, show: { y: 0 } }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <span className="k-sheet-grab" aria-hidden="true" />
            <div className="k-sheet-head">
              <h2 className="k-h2">{title}</h2>
              <IconButton icon="x" label="Close" size={40} onClick={onClose} />
            </div>
            <ul className="k-langs">
              {LANGUAGES.map((l, i) => {
                const on = l.code === value;
                const soon = LIVE_TRANSLATE && !LIVE_CODES.includes(l.code);
                return (
                  <li key={l.code} style={{ "--i": i }}>
                    <button type="button" className={`k-lang${on ? " is-on" : ""}${soon ? " is-soon" : ""}`} onClick={() => !soon && onPick(l.code)} aria-pressed={on} disabled={soon}>
                      <Flag code={l.code} size={40} />
                      <span className="k-lang-text">
                        <span className="k-lang-name">{l.label}</span>
                        <span className="k-lang-sub">{soon ? `${l.english} · coming soon` : l.english}</span>
                      </span>
                      <span className="k-lang-check" aria-hidden="true"><Icon name="check" size={16} strokeWidth={2.6} /></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- ThemeToggle (moon / sun) ----------
export function ThemeToggle() {
  const [dark, setDark] = useState(null);
  useEffect(() => setDark(isDarkNow()), []);
  function toggle() {
    const next = !dark;
    setDark(next);
    setThemePref(next ? "dark" : "light");
  }
  return (
    <IconButton label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggle} size={44}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "sun" : "moon"}
          style={{ display: "grid" }}
          initial={{ rotate: -120, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 120, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.28, ease }}
        >
          <Icon name={dark ? "sun" : "moon"} size={19} />
        </motion.span>
      </AnimatePresence>
    </IconButton>
  );
}

export { getThemePref, setThemePref };

// ---------- Toast ----------
export function Toast({ message, icon = "check" }) {
  return (
    <div className="k-toast-wrap" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            className={`k-toast${icon === "alert" ? " is-alert" : ""}`}
            initial={{ opacity: 0, y: -18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={spring}
          >
            <span className="k-toast-icon"><Icon name={icon} size={15} strokeWidth={2.4} /></span>
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- PageHeader ----------
export function PageHeader({ eyebrow, title, sub, action, id }) {
  const auto = useId();
  return (
    <header className="k-page-head">
      <div className="k-page-head-text">
        {eyebrow && <span className="k-eyebrow">{eyebrow}</span>}
        <h1 className="k-h1" id={id || auto}>{title}</h1>
        {sub && <p className="k-lead">{sub}</p>}
      </div>
      {action}
    </header>
  );
}
