"use client";

import { useEffect } from "react";

const reduced = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// One ripple for every tappable surface, added by a single listener on the document.
const PRESSABLE = ".k-btn, .k-chip, .k-select, .k-choice, .k-lang, .k-row-btn, .k-option, .k-phrase-sum, .k-note-sum, .k-quick, .k-seg-btn";

export function useRipple() {
  useEffect(() => {
    if (reduced()) return;
    function onDown(event) {
      const el = event.target instanceof Element ? event.target.closest(PRESSABLE) : null;
      if (!el || el.disabled) return;
      const box = el.getBoundingClientRect();
      const dot = document.createElement("span");
      dot.className = "k-ripple";
      dot.setAttribute("aria-hidden", "true");
      dot.style.left = `${event.clientX - box.left}px`;
      dot.style.top = `${event.clientY - box.top}px`;
      el.classList.add("k-press");
      el.appendChild(dot);
      const clear = () => dot.remove();
      dot.addEventListener("animationend", clear, { once: true });
      setTimeout(clear, 800);
    }
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
}

// Cards below the fold rise into place the first time they scroll into view.
const REVEAL = ".k-reveal";
export function useScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || reduced()) return;
    const seen = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("k-in");
        seen.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    const scan = () => document.querySelectorAll(REVEAL).forEach((el) => {
      if (el.classList.contains("k-seen")) return;
      el.classList.add("k-seen");
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) { el.classList.add("k-wait"); seen.observe(el); }
    });
    scan();
    const watch = new MutationObserver(scan);
    watch.observe(document.body, { childList: true, subtree: true });
    return () => { seen.disconnect(); watch.disconnect(); };
  }, []);
}

// Cards marked .k-tilt lean toward the pointer (mouse and pen only).
export function useTilt() {
  useEffect(() => {
    if (reduced() || !window.matchMedia?.("(hover: hover)").matches) return;
    let current = null;
    function onMove(event) {
      const el = event.target instanceof Element ? event.target.closest(".k-tilt") : null;
      if (current && current !== el) { current.style.setProperty("--rx", "0deg"); current.style.setProperty("--ry", "0deg"); }
      current = el;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      el.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    }
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
}
