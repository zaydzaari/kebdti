"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "../icons";

const NAME = "Kebdti".split("");
const ease = [0.22, 1, 0.36, 1];

// Logo sequence: the mark pops and beats, the name rises letter by letter,
// the Arabic draws its underline, a progress thread fills, then the whole thing lifts away.
export function Splash({ onDone }) {
  const reduce = useReducedMotion();
  const total = reduce ? 700 : 2300;
  useEffect(() => {
    const t = setTimeout(onDone, total);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="k-splash"
      onClick={onDone}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDone(); } }}
      role="button"
      aria-label="Kebdti. Tap to continue"
      exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)", transition: { duration: 0.45, ease } }}
    >
      <span className="k-splash-glow" aria-hidden="true" />
      <div className="k-splash-inner">
        <motion.span
          className="k-splash-mark"
          initial={{ scale: 0.3, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.05 }}
        >
          <BrandMark size={88} />
        </motion.span>
        <h1 className="k-splash-name" aria-hidden="true">
          {NAME.map((ch, i) => (
            <motion.span key={i} initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 + i * 0.05, duration: 0.6, ease }}>{ch}</motion.span>
          ))}
        </h1>
        <motion.p className="k-splash-ar" lang="ar" dir="rtl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.5, ease }}>
          كبدتي
          <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.95, duration: 0.6, ease }} />
        </motion.p>
        <motion.p className="k-splash-tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}>
          Family voice notes, translated with the feeling kept
        </motion.p>
      </div>
      <motion.span className="k-splash-progress" aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: total / 1000, ease: "linear" }} />
    </motion.div>
  );
}
