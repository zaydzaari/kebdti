/* Kebdti MVP front end. Plain JS, no build step.
   Grandchild app: /      Grandma mode: /?grandma=1      (embedded grandma phone: /?grandma=1&embed=1)
   Everything shown comes from the real backend (speech recognition -> GPT-6 Luna -> Gemini voice). */

const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => (s ?? "").toString().replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const params = new URLSearchParams(location.search);
const IS_GRANDMA = params.has("grandma");
const IS_EMBED = params.has("embed");

const I = {
  heart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2.5"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>',
  swap: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 7h12l-3-3M17 17H5l3 3"/></svg>',
  send: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/></svg>',
  trash: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  translate: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  between: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20s-7-4.3-8.9-8.6C1.7 8.2 3.6 5 6.9 5c2 0 3.4 1.1 4.1 2.2h2C13.7 6.1 15.1 5 17.1 5c3.3 0 5.2 3.2 3.8 6.4C19 15.7 12 20 12 20z"/></svg>',
  book: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5zM20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5-.7 1.5-1.5z"/></svg>',
  person: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12.5 10 17l9-10"/></svg>',
};

const LANGS = { fr: "Français", es: "Español", it: "Italiano", en: "English" };
const FLAGS = { fr: '<span class="lc">FR</span>', es: '<span class="lc">ES</span>', it: '<span class="lc">IT</span>', en: '<span class="lc">EN</span>', darija: '<span class="lc ma">MA</span>' };
const CITY = { fr: "Lyon", es: "Madrid", it: "Milano", en: "London" };
const FEEL = { love: "affection", longing: "longing", care: "care", worry: "worry", pride: "pride", blessing: "blessing",
               humor: "humour", gratitude: "gratitude", sadness: "sadness", neutral: "everyday" };
const UI = {
  fr: { type: "Ou écris ton message…", heard: "Elle l'entendra en darija" },
  es: { type: "O escribe tu mensaje…", heard: "Lo oirá en darija" },
  it: { type: "Oppure scrivi il messaggio…", heard: "Lo sentirà in darija" },
  en: { type: "Or type your message…", heard: "They'll hear it in Darija" },
};
const ADDRESS = { grandmother: ["أ جدة", "أ جدتي", "أ ميمة", "أ حنا", "أ لالة"], grandfather: ["أ جدي", "أ سيدي", "أ بابا الحاج", "أ بابا"] };

// ------------------------------------------------------------------ state
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem("kebdti." + k)) ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem("kebdti." + k, JSON.stringify(v)); },
};
const DEFAULT_PROFILE = { grandparent: "grandmother", gp_name: "Mi Fatna", address: "أ جدة", gc_name: "Yanis", gender: "boy", lang: "fr", family: "Benali" };
const DEFAULT_WORDS = [{ expression: "Kebdti (كبدتي)", meaning: "the name only grandma uses for me: my darling", who: "Grandma" }];
let profile = { ...DEFAULT_PROFILE, ...store.get("profile", {}) };
let familyWords = store.get("words", DEFAULT_WORDS);
const SEEN_KEY = IS_GRANDMA ? "seen_gm" : "seen";
let seen = new Set(store.get(SEEN_KEY, []));
const saveSeen = () => store.set(SEEN_KEY, [...seen].slice(-300));
let tab = "translate";
let direction = "out";             // out: grandchild -> grandparent (Darija).  in: grandparent (Darija) -> grandchild
let pinnedPrompt = null;
let convo = [];
let pending = [];                  // {id, kind, voice, started}
let phrases = [], phraseCat = "all", phraseMode = "mean";
let starterIdx = 0;

const isGpa = () => profile.grandparent === "grandfather";
const gpTitle = () => isGpa() ? "Grandpa" : "Grandma";
const herHim = () => isGpa() ? "his" : "her";
const sheHe = () => isGpa() ? "he" : "she";
const initial = s => (s || "?").trim().replace(/^(mi|mii|lalla|sidi)\s+/i, "").charAt(0).toUpperCase();
function ago(t) {
  const s = Math.max(0, Date.now() / 1000 - (t || 0));
  if (s < 60) return "just now"; if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`; return new Date(t * 1000).toLocaleDateString();
}
function apiProfile() {
  return { grandparent: profile.grandparent, address: profile.address, grandchild_gender: profile.gender,
           grandchild_lang: profile.lang, family_words: familyWords.map(w => ({ expression: w.expression, meaning: w.meaning })) };
}

// ------------------------------------------------------------------ helpers
function toast(msg) {
  let t = $(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; $("#app").appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2400);
}

async function send(endpoint, { blob, text }) {
  const fd = new FormData();
  if (blob) fd.append("audio", blob, "voice.webm");
  fd.append("text", text || "");
  fd.append("profile", JSON.stringify(apiProfile()));
  const res = await fetch(endpoint, { method: "POST", body: fd });
  const r = await res.json().catch(() => ({ error: "The server didn't answer. Is it running?" }));
  if (!res.ok || r.error) throw new Error(r.error || "Something went wrong.");
  return r;
}

function statusBar() {
  const d = new Date();
  return `<div class="statusbar"><span class="clock">${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}</span>
    <span class="right"><span class="sig"><i style="height:4px"></i><i style="height:6px"></i><i style="height:8px"></i><i style="height:11px"></i></span><span class="batt"></span></span></div>`;
}

// one audio at a time
let current = null;
function makePlayer(url, { label = "", big = false, seed = url || "x" } = {}) {
  const wrap = document.createElement("div");
  if (!url) { wrap.innerHTML = `<div class="err">The voice isn't available right now (free voice quota). The text is still right.</div>`; return wrap; }
  const audio = new Audio(url);
  if (big) {
    wrap.innerHTML = `<button class="bigplay" aria-label="play">${I.play}</button>`;
  } else {
    let h = 7; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const bars = Array.from({ length: 32 }, (_, i) => 22 + (((h >> (i % 27)) ^ (i * 7)) & 7) * 10);
    wrap.className = "player";
    wrap.innerHTML = `<button class="play" aria-label="play">${I.play}</button>
      <div class="wave">${bars.map(b => `<i style="height:${Math.min(b, 100)}%"></i>`).join("")}</div>
      <div class="meta"><span class="dur">0:00</span><br>${esc(label)}</div>`;
  }
  const btn = wrap.querySelector("button");
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  audio.addEventListener("loadedmetadata", () => { const d = wrap.querySelector(".dur"); if (d && isFinite(audio.duration)) d.textContent = fmt(audio.duration); });
  audio.addEventListener("timeupdate", () => {
    const bars = wrap.querySelectorAll(".wave i"); const k = Math.round(audio.currentTime / (audio.duration || 1) * bars.length);
    bars.forEach((b, i) => b.classList.toggle("on", i < k));
  });
  audio.addEventListener("ended", () => { btn.innerHTML = I.play; wrap.querySelectorAll(".wave i").forEach(b => b.classList.remove("on")); });
  audio.addEventListener("pause", () => (btn.innerHTML = I.play));
  audio.addEventListener("play", () => (btn.innerHTML = I.pause));
  btn.onclick = () => {
    if (!audio.paused) { audio.pause(); return; }
    if (current && current !== audio) current.pause();
    current = audio; audio.play().catch(() => toast("Tap again to play"));
  };
  wrap.play = () => btn.click();
  return wrap;
}

// tap to start, tap to stop. Shows a timer and live microphone levels.
function makeRecorder(button, { onBlob, onState, ring, levels, timer, maxSeconds = 90 }) {
  let rec = null, chunks = [], stream = null, ctx = null, raf = 0, tick = 0, t0 = 0;
  const bars = levels ? [...levels.querySelectorAll("i")] : [];
  const stopVisuals = () => {
    cancelAnimationFrame(raf); clearInterval(tick); ctx && ctx.close().catch(() => {}); ctx = null;
    bars.forEach(b => (b.style.height = "5px")); ring && ring.classList.remove("rec"); button.classList.remove("rec");
    button.innerHTML = I.mic;
  };
  button.addEventListener("click", async () => {
    if (button.classList.contains("busy")) return;
    if (rec && rec.state === "recording") { rec.stop(); return; }
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { onState("nomic"); return; }
    chunks = []; rec = new MediaRecorder(stream);
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      stream.getTracks().forEach(t => t.stop()); stopVisuals();
      const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
      if (blob.size < 2000 || Date.now() - t0 < 700) { onState("short"); return; }
      onBlob(blob);
    };
    rec.start(); t0 = Date.now();
    button.classList.add("rec"); button.innerHTML = I.stop; ring && ring.classList.add("rec"); onState("recording");
    if (timer) { const upd = () => { const s = Math.floor((Date.now() - t0) / 1000); timer.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; if (s >= maxSeconds) rec.stop(); }; upd(); tick = setInterval(upd, 250); }
    if (bars.length) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        const an = ctx.createAnalyser(); an.fftSize = 256; ctx.createMediaStreamSource(stream).connect(an);
        const data = new Uint8Array(an.frequencyBinCount);
        const draw = () => { an.getByteFrequencyData(data); bars.forEach((b, i) => { const v = data[3 + i * 4] / 255; b.style.height = `${5 + v * 22}px`; }); raf = requestAnimationFrame(draw); };
        draw();
      } catch { /* levels are decoration only */ }
    }
  });
}

// step-by-step progress while the backend works (estimated timings)
function stepperCard(p) {
  const steps = p.kind === "out"
    ? [...(p.voice ? ["Listening to your voice"] : []), `Finding the warmest Darija for ${profile.gp_name}`, `Giving it a voice ${sheHe()} can hear`]
    : [...(p.voice ? ["Listening to the Darija"] : []), "Understanding the feeling behind the words", `Speaking it in ${LANGS[profile.lang]}`];
  const marks = p.voice ? [0, 3.5, 12] : [0, 9];
  const el = document.createElement("div"); el.className = "stepper"; el.dataset.pending = p.id;
  el.innerHTML = `<div class="title">Kebdti is working · about 15 seconds</div>` + steps.map(s => `<div class="st"><span class="dot"></span>${esc(s)}</div>`).join("");
  const upd = () => {
    if (!el.isConnected) return clearInterval(h);
    const t = (Date.now() - p.started) / 1000; let k = 0; marks.forEach((m, i) => { if (t >= m) k = i; });
    el.querySelectorAll(".st").forEach((s, i) => { s.className = "st" + (i < k ? " done" : i === k ? " active" : ""); s.querySelector(".dot").innerHTML = i < k ? "✓" : ""; });
  };
  const h = setInterval(upd, 400); upd();
  return el;
}

// ------------------------------------------------------------------ message cards (grandchild app)
function feelingPills(list) {
  if (!list?.length) return "";
  return `<div class="pills"><span class="lbl">Feels like</span>${list.map(f => `<span class="pill ${f === "neutral" ? "everyday" : ""}">${esc(FEEL[f] || f)}</span>`).join("")}</div>`;
}
function card(m) {
  const el = document.createElement("div");
  el.dataset.id = m.id;
  if (m.direction === "from_grandparent") {
    el.className = "msg incoming";
    const isNew = !seen.has(m.id);
    const notes = m.notes || [];
    const unsure = notes.filter(n => (n.meaning || "").toLowerCase().startsWith("uncertain"));
    const ok = notes.filter(n => !unsure.includes(n));
    el.innerHTML = `
      <div class="msg-head"><div class="av gp">${esc(initial(profile.gp_name))}</div>
        <div><div class="nm">${esc(profile.gp_name)}</div><div class="sub">${ago(m.at)} · in ${LANGS[m.lang] || m.lang}</div></div>
        ${isNew ? '<span class="new">new</span>' : ""}</div>
      <div class="main">${esc(m.text)}</div>
      ${m.word_for_word ? `<div class="w4w">Word for word: <s>${esc(m.word_for_word)}</s></div>` : ""}
      <div class="slot-player"></div>
      <div class="voice-label">Read aloud · device voice, not a copy of ${herHim()} voice yet</div>
      ${feelingPills(m.feeling)}
      ${ok.length ? `<div class="why"><div class="t">${I.heart} Why it's said this way</div>${ok.map(n =>
        `<div class="item"><b>${esc(n.expression)}</b>: literally “${esc((n.literal || "").replace(/[.。]+$/, ""))}”. ${esc(n.meaning)}</div>`).join("")}</div>` : ""}
      ${unsure.length || m.confidence === "low" ? `<div class="unsure">⚠︎ Kebdti isn't sure about ${unsure.length ? "“" + esc(unsure.map(n => n.expression).join("”, “")) + "”" : "this one"}. Ask ${isGpa() ? "him" : "her"} what ${sheHe()} meant!</div>` : ""}
      <details class="orig"><summary>What ${sheHe()} said in Darija</summary><div class="ar">${esc(m.original)}</div></details>`;
    $(".slot-player", el).appendChild(makePlayer(m.audio_url, { label: "Read aloud", seed: m.id }));
  } else {
    el.className = "msg outgoing";
    el.innerHTML = `
      <div class="msg-head"><div class="av gc">${esc(initial(profile.gc_name))}</div>
        <div><div class="nm">You → ${esc(profile.gp_name)}</div><div class="sub">${ago(m.at)} · sent in Darija</div></div>
        <span class="tick">${I.check}</span></div>
      <div class="quote">“${esc(m.original)}”</div>
      <div class="main ar">${esc(m.text)}</div>
      <div class="slot-player"></div>
      <div class="voice-label">${esc((UI[profile.lang] || UI.en).heard)}</div>`;
    $(".slot-player", el).appendChild(makePlayer(m.audio_url, { label: "Darija", seed: m.id }));
  }
  return el;
}

// ------------------------------------------------------------------ tabs
function shell() {
  $("#app").className = "app";
  $("#app").innerHTML = `${statusBar()}
    <div class="appbar"><div class="brand">${I.heart}Kebdti</div><div class="family-pill">${esc(profile.family)} family</div></div>
    <div class="screen" id="screen"></div>
    <nav class="tabbar">
      ${[["translate", "Translate", I.translate], ["between", "Between us", I.between], ["phrases", "Phrases", I.book], ["profile", "Profile", I.person]]
        .map(([k, l, ic]) => `<button class="tab ${tab === k ? "on" : ""}" data-tab="${k}"><span class="ic">${ic}</span><span>${l}</span></button>`).join("")}
    </nav>`;
  document.querySelectorAll(".tab").forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });
}

function render() {
  updateCaptions();
  if (IS_GRANDMA) return renderGrandma();
  shell();
  ({ translate: renderTranslate, between: renderBetween, phrases: renderPhrases, profile: renderProfile })[tab]();
  $("#screen").scrollTop = 0;
}

// ---------- Translate
function renderTranslate() {
  const lang = LANGS[profile.lang];
  const youSpeak = direction === "out" ? `${FLAGS[profile.lang]} ${lang}` : `${FLAGS.darija} Darija`, into = direction === "out" ? `${FLAGS.darija} Darija` : `${FLAGS[profile.lang]} ${lang}`;
  const ui = UI[profile.lang] || UI.en;
  $("#screen").innerHTML = `
    <div class="welcome"><div class="arch"><div class="arch-in"><span>كبدتي</span></div></div><div>
      <h2>For the things only family can say</h2>
      <p>Keep the affection. Find the words. Send a little piece of home.</p></div></div>
    <div class="direction">
      <div class="lang-box"><small>You speak</small><b>${youSpeak}</b></div>
      <button class="swap" id="swap" title="Swap">${I.swap}</button>
      <div class="lang-box"><small>Into</small><b>${into}</b></div>
    </div>
    ${pinnedPrompt && direction === "out" ? `<div class="prompt-pin">💭 <div><b>A thought to start with</b><br>${esc(pinnedPrompt)}</div><button id="unpin">✕</button></div>` : ""}
    <div class="card recorder" id="recCard">
      <h3>Record a voice note</h3>
      <p>${direction === "out" ? `Speak in ${lang}. ${esc(profile.gp_name)} will hear what you mean, in Darija.`
                                 : `Speak in Darija. Kebdti writes what you mean in ${lang}.`}</p>
      <div class="mic-wrap" id="ring"><button class="mic" id="mic" aria-label="record">${I.mic}</button></div>
      <div class="levels" id="levels">${"<i></i>".repeat(9)}</div>
      <div class="rec-status" id="recStatus">Tap to start, tap again to send</div>
      <div class="type-row">
        <input id="typed" placeholder="${direction === "out" ? esc(ui.type) : "أو كتب بالدارجة…"}" ${direction === "in" ? 'dir="rtl"' : ""}>
        <button class="btn small" id="sendTyped" aria-label="send">${I.send}</button>
      </div>
    </div>
    <h3>Between you two</h3>
    <div id="list"></div>`;
  $("#swap").onclick = () => { direction = direction === "out" ? "in" : "out"; render(); };
  if ($("#unpin")) $("#unpin").onclick = () => { pinnedPrompt = null; render(); };
  const go = payload => submit(direction === "out" ? "out" : "in", payload);
  const status = $("#recStatus");
  makeRecorder($("#mic"), {
    ring: $("#ring"), levels: $("#levels"), timer: status,
    onBlob: blob => { $("#recCard").classList.remove("recording"); go({ blob }); },
    onState: s => {
      $("#recCard").classList.toggle("recording", s === "recording");
      if (s !== "recording") status.textContent = { nomic: "Microphone blocked here. Open the app in Chrome, or type below.", short: "That was too short. Try again." }[s] || "";
    },
  });
  const sendTyped = () => { const v = $("#typed").value.trim(); if (v) { go({ text: v }); $("#typed").value = ""; } };
  $("#sendTyped").onclick = sendTyped;
  $("#typed").onkeydown = e => e.key === "Enter" && sendTyped();
  fillList();
}

function fillList() {
  const list = $("#list"); if (!list) return;
  list.innerHTML = "";
  pending.forEach(p => list.appendChild(stepperCard(p)));
  const items = convo.slice().reverse();
  if (!items.length && !pending.length) list.innerHTML = `<div class="empty">No messages yet.<br>Send the first one ❤</div>`;
  items.forEach(m => list.appendChild(card(m)));
  items.forEach(m => seen.add(m.id)); saveSeen();
}

async function submit(kind, payload) {
  const p = { id: Math.random().toString(36).slice(2), kind, voice: !!payload.blob, started: Date.now() };
  pending.push(p); fillList();
  $("#list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const mic = $("#mic"); if (mic) mic.classList.add("busy");
  try {
    const r = await send(kind === "out" ? "/api/grandchild" : "/api/grandparent", payload);
    if (!convo.some(m => m.id === r.id)) convo.push(r);
    pending = pending.filter(x => x !== p);
    if (tab === "translate") { fillList(); $("#list .msg .play")?.click(); }
    pinnedPrompt = null;
    toast(kind === "out" ? `Sent to ${profile.gp_name} ❤` : "Translated with the feeling ❤");
  } catch (e) {
    pending = pending.filter(x => x !== p); fillList();
    const err = document.createElement("div"); err.className = "err"; err.textContent = e.message;
    $("#list")?.prepend(err); setTimeout(() => err.remove(), 7000);
  } finally {
    $("#mic")?.classList.remove("busy");
    const st = $("#recStatus"); if (st) st.textContent = "Tap to start, tap again to send";
  }
}

// ---------- Between us
const STARTERS = [
  ["Everyday things", "What was the nicest part of your day?", "Ash kan ahsen haja f nharek lyoum?"],
  ["Food", "Ask about the dish that always brings the family together.", "What's the secret of your couscous?"],
  ["Family stories", "Ask how they met their husband or wife.", "How did you and grandpa meet?"],
  ["Childhood", "Ask what they played when they were your age.", "What games did you play as a child?"],
  ["Eid & traditions", "Ask about their favourite Eid memory.", "What was Eid like when you were young?"],
  ["Advice", "Ask for the one piece of advice they'd give you.", "What should I never forget?"],
];
function renderBetween() {
  const s = STARTERS[starterIdx % STARTERS.length];
  $("#screen").innerHTML = `
    <div class="eyebrow">Conversation starters · your next voice note</div>
    <h2>Ask for the stories<br><em>you haven't heard.</em></h2>
    <div class="card starter">
      <span class="count">${starterIdx % STARTERS.length + 1} / ${STARTERS.length}</span>
      <div class="cat">${s[0]}</div>
      <div class="q">${esc(s[1])}</div>
      <div class="ex">“${esc(s[2])}”</div>
      <div class="row"><button class="link" id="useStarter">Make a voice note →</button><button class="icon-btn" id="nextStarter" aria-label="another">${I.refresh}</button></div>
    </div>
    <div class="eyebrow" style="margin-top:22px">Your family's expressions</div>
    <h2>The name<br><em>only ${gpTitle().toLowerCase()} uses.</em></h2>
    <p class="lead">Nicknames, little sayings and what they mean to you. Kebdti uses them first when it translates.</p>
    <div class="card" id="famList"></div>
    <div class="card">
      <b>Only our family says that</b>
      <div class="form-grid" style="margin-top:10px">
        <input id="famExpr" placeholder="Expression (e.g. a 3zizti, ya l9mer)">
        <input id="famMean" placeholder="What it means to you">
        <button class="btn" id="famAdd">Add an expression</button>
      </div>
      <div class="saved-note">${I.check} Saved on this device · used by Kebdti when translating</div>
    </div>`;
  $("#nextStarter").onclick = () => { starterIdx++; renderBetween(); };
  $("#useStarter").onclick = () => { pinnedPrompt = s[1]; direction = "out"; tab = "translate"; render(); };
  const fl = $("#famList");
  fl.innerHTML = familyWords.length ? familyWords.map((w, i) => `
    <div class="fam-item"><div><div class="name">${esc(w.expression)}</div><div class="tiny">${esc(w.who || "Family")} · ${esc(w.meaning)}</div></div>
    <button class="icon-btn" data-del="${i}" aria-label="delete">${I.trash}</button></div>`).join("") : `<div class="empty">No family words yet.</div>`;
  fl.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { familyWords.splice(+b.dataset.del, 1); store.set("words", familyWords); renderBetween(); });
  $("#famAdd").onclick = () => {
    const e = $("#famExpr").value.trim(), m = $("#famMean").value.trim();
    if (!e || !m) { toast("Add the expression and what it means"); return; }
    familyWords.push({ expression: e, meaning: m, who: gpTitle() }); store.set("words", familyWords);
    toast("Family expression saved ❤"); renderBetween();
  };
}

// ---------- Phrases
const CAT_NAME = { love: "Love", blessings: "Blessings", missing: "Missing you", everyday: "Everyday", proverbs: "Proverbs" };
async function renderPhrases() {
  if (!phrases.length) phrases = await fetch("/static/phrases.json").then(r => r.json());
  const L = profile.lang;
  const cats = [["all", `All ${phrases.length}`], ...Object.entries(CAT_NAME)];
  const list = phrases.filter(p => phraseCat === "all" || p.cat === phraseCat);
  $("#screen").innerHTML = `
    <div class="eyebrow">Some words need more than translation</div>
    <div class="card hero-phrase">
      <div class="toggle"><button data-m="word" class="${phraseMode === "word" ? "on" : ""}">Word for word</button><button data-m="mean" class="${phraseMode === "mean" ? "on" : ""}">What they mean</button></div>
      <div class="big">${phraseMode === "word" ? "“My liver”?" : "“My darling, my heart”"}</div>
      <div class="lead" style="margin:0">${phraseMode === "word" ? "That's what a normal translator says when grandma calls you <i>kebdti</i>." : "In Darija, deep love lives in the liver, not the heart. It's the tenderest word a grandmother has for a grandchild."}</div>
    </div>
    <div class="chips">${cats.map(([k, l]) => `<button class="chip ${phraseCat === k ? "on" : ""}" data-c="${k}">${l}</button>`).join("")}</div>
    <div id="plist"></div>`;
  document.querySelectorAll(".toggle button").forEach(b => b.onclick = () => { phraseMode = b.dataset.m; renderPhrases(); });
  document.querySelectorAll(".chip").forEach(b => b.onclick = () => { phraseCat = b.dataset.c; renderPhrases(); });
  const pl = $("#plist");
  list.forEach(p => {
    const el = document.createElement("div"); el.className = "card phrase";
    el.innerHTML = `
      <div class="top"><div><div class="cat-tag">${CAT_NAME[p.cat] || ""}</div><div class="ar">${esc(p.darija)}</div><div class="lat">${esc(p.latin)}</div></div>
      <button class="icon-btn" aria-label="listen">${I.speaker}</button></div>
      <div class="kv"><span class="k">Word for word</span><span><s>${esc(p.literal[L] || p.literal.en)}</s></span>
      <span class="k">Means</span><span><b>${esc(p.means.en)}</b></span>
      ${L !== "en" ? `<span class="k">In ${LANGS[L]}</span><span>${esc(p.means[L] || p.means.en)}</span>` : ""}</div>
      <div class="why-line">${esc(p.why)}</div>`;
    const btn = $(".icon-btn", el);
    btn.onclick = async () => {
      btn.innerHTML = '<div class="spin"></div>';
      try {
        const r = await fetch("/api/speak", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: p.darija, lang: "darija", speaker: profile.grandparent }) }).then(r => r.json());
        if (r.error) throw new Error(r.error);
        if (current) current.pause(); current = new Audio(r.audio_url); current.play();
      } catch { toast("Voice not available right now"); }
      btn.innerHTML = I.speaker;
    };
    pl.appendChild(el);
  });
}

// ---------- Profile
function renderProfile() {
  const seg = (k, opts) => `<div class="seg" data-seg="${k}">${opts.map(([v, l]) => `<button data-v="${v}" class="${profile[k] === v ? "on" : ""}">${l}</button>`).join("")}</div>`;
  $("#screen").innerHTML = `
    <div class="eyebrow">Your family space</div>
    <h2>A little closer,<br><em>in every language.</em></h2>
    <div class="duo">
      <div class="person"><div class="big-av gc">${profile.gender === "girl" ? "👧" : "👦"}</div>
        <input data-k="gc_name" value="${esc(profile.gc_name)}" aria-label="your name"><small>you</small>
        ${seg("gender", [["boy", "Boy"], ["girl", "Girl"]])}</div>
      <div class="person"><div class="big-av gp">${isGpa() ? "👴" : "👵"}</div>
        <input data-k="gp_name" value="${esc(profile.gp_name)}" aria-label="grandparent name"><small>speaks Darija</small>
        ${seg("grandparent", [["grandmother", "Grandma"], ["grandfather", "Grandpa"]])}</div>
    </div>
    <div class="card">
      <span class="field-l" style="margin-top:0">Your language</span>
      <div class="langs">${Object.entries(LANGS).map(([k, v]) => `<button data-lang="${k}" class="${profile.lang === k ? "on" : ""}"><span class="fl">${FLAGS[k]}</span>${v}</button>`).join("")}</div>
      <span class="field-l">What you call ${isGpa() ? "him" : "her"} in Darija</span>
      <div class="addr">${ADDRESS[profile.grandparent].map(a => `<button data-addr="${a}" class="${profile.address === a ? "on" : ""}">${a}</button>`).join("")}</div>
      <div class="form-grid" style="margin-top:8px"><input data-k="address" dir="rtl" value="${esc(profile.address)}" placeholder="…or your own word"></div>
      <span class="field-l">Family name</span>
      <div class="form-grid"><input data-k="family" value="${esc(profile.family)}"></div>
      <div class="saved-note">${I.check} Saved on this device</div>
    </div>
    <a class="btn" style="width:100%" href="/?grandma=1" target="kebdti-grandma">Open ${gpTitle().toLowerCase()}'s phone ↗</a>
    <h3>How Kebdti works</h3>
    <div class="card"><ol class="steps">
      <li><span>Listens to the voice note (Gemini speech recognition, Darija-aware).</span></li>
      <li><span>Translates the feeling, not the words (GPT-6 Luna with a Moroccan elder-speech guide and your family's own expressions).</span></li>
      <li><span>Speaks it back in the other language (Gemini voice; device voice, not a copy of anyone's voice).</span></li>
      <li><span>Tells you when it isn't sure, instead of guessing.</span></li>
    </ol></div>
    <button class="btn ghost" style="width:100%" id="clear">Clear the conversation</button>
    <p class="tiny" style="text-align:center;margin-top:14px">Kebdti · Veritas AI Hackathon 2026 · working MVP</p>`;
  const save = (msg = "Saved") => { store.set("profile", profile); toast(msg); updateCaptions(); };
  document.querySelectorAll("[data-k]").forEach(inp => inp.onchange = () => { profile[inp.dataset.k] = inp.value.trim(); save(); if (inp.dataset.k === "family") render(); });
  document.querySelectorAll("[data-seg]").forEach(sg => sg.querySelectorAll("button").forEach(b => b.onclick = () => {
    const k = sg.dataset.seg; profile[k] = b.dataset.v;
    if (k === "grandparent" && !ADDRESS[b.dataset.v].includes(profile.address)) profile.address = ADDRESS[b.dataset.v][0];
    save(); renderProfile();
  }));
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { profile.lang = b.dataset.lang; save(`${LANGS[profile.lang]} ✓`); renderProfile(); });
  document.querySelectorAll("[data-addr]").forEach(b => b.onclick = () => { profile.address = b.dataset.addr; save(); renderProfile(); });
  $("#clear").onclick = async () => { await fetch("/api/conversation/clear", { method: "POST" }); convo = []; toast("Conversation cleared"); };
}

// ------------------------------------------------------------------ grandma mode
let soundOn = false, gmBusy = false;
function renderGrandma() {
  const app = $("#app");
  app.className = "app gm";
  app.innerHTML = `${statusBar()}
    <div class="gm-head"><div class="gc-av">${profile.gender === "girl" ? "👧" : "👦"}</div><div class="nm">${esc(profile.gc_name)}</div></div>
    <div class="screen" id="gmList"></div>
    <div class="gm-bottom">
      <div class="gm-mic-wrap" id="gmRing"><button class="gm-mic" id="gmMic" aria-label="record">${I.mic}</button></div>
      <div class="gm-timer" id="gmState"></div>
    </div>
    ${soundOn ? "" : `<div class="sound-gate"><div><button id="gate" aria-label="start">${I.play}</button></div></div>`}`;
  if (!soundOn) $("#gate").onclick = () => { soundOn = true; renderGrandma(); };
  fillGrandma();
  const st = $("#gmState");
  makeRecorder($("#gmMic"), {
    ring: $("#gmRing"), timer: st,
    onState: s => { if (s !== "recording") st.textContent = { nomic: "🎙️✕", short: "↺" }[s] || ""; },
    onBlob: async blob => {
      gmBusy = true; $("#gmMic").classList.add("busy"); st.innerHTML = '<div class="spin" style="margin:4px auto;width:26px;height:26px"></div>';
      try { const r = await send("/api/grandparent", { blob }); if (!convo.some(m => m.id === r.id)) convo.push(r); st.textContent = "✓"; fillGrandma(); }
      catch { st.textContent = "↺"; }
      gmBusy = false; $("#gmMic")?.classList.remove("busy"); setTimeout(() => { if (!gmBusy && $("#gmState")) $("#gmState").textContent = ""; }, 2500);
    },
  });
}

function fillGrandma(autoplayId) {
  const list = $("#gmList"); if (!list) return;
  list.innerHTML = "";
  if (!convo.length) list.innerHTML = `<div class="empty" style="font-size:44px;padding-top:50px">❤</div>`;
  convo.slice(-20).forEach(m => {
    const el = document.createElement("div");
    if (m.direction === "from_grandchild") {
      el.className = "gm-msg" + (seen.has(m.id) ? "" : " unread");
      el.innerHTML = `<div class="face">${profile.gender === "girl" ? "👧" : "👦"}</div><div><div class="ar">${esc(m.text)}</div><div class="time">${ago(m.at)}</div></div>`;
      const p = makePlayer(m.audio_url, { big: true });
      el.appendChild(p);
      p.querySelector("button")?.addEventListener("click", () => { seen.add(m.id); el.classList.remove("unread"); saveSeen(); });
      if (autoplayId === m.id && soundOn) setTimeout(() => p.play && p.play(), 300);
    } else {
      el.className = "gm-msg mine";
      el.innerHTML = `<div><div class="ar">${esc(m.original)}</div><div class="time" style="text-align:right">${ago(m.at)}</div></div><div style="color:var(--green)">${I.check}</div>`;
    }
    list.appendChild(el);
  });
  list.scrollTop = 1e9;
}

// ------------------------------------------------------------------ desktop: both phones side by side
function updateCaptions() {
  const gc = $("#capGc"), gp = $("#capGp");
  if (gc) { gc.textContent = profile.gc_name; gc.parentElement.lastChild.textContent = ` · in ${CITY[profile.lang]}`; }
  if (gp) gp.textContent = profile.gp_name;
}
function setupDesktop() {
  if (IS_EMBED) { document.body.classList.add("embed"); return; }
  if (IS_GRANDMA) { $("#hero") && ($("#hero").style.display = "none"); $("#gmWrap")?.classList.add("hidden"); return; }
  const wide = window.matchMedia("(min-width: 1281px)");
  const frame = $("#gmFrame"), btn = $("#openGrandma");
  const sync = () => {
    if (wide.matches) {
      if (!frame.src) frame.src = "/?grandma=1&embed=1";
      btn.textContent = $("#gmWrap").classList.contains("hidden") ? "Show grandma's phone" : "Hide grandma's phone";
      btn.onclick = e => { e.preventDefault(); $("#gmWrap").classList.toggle("hidden"); sync(); };
    } else { btn.textContent = "Open grandma's phone ↗"; btn.onclick = null; }
  };
  wide.addEventListener("change", sync); sync();
}

// ------------------------------------------------------------------ live sync (both phones share the conversation)
async function poll() {
  try {
    const data = await fetch("/api/conversation").then(r => r.json());
    if (data.length < convo.length) { convo = data; IS_GRANDMA ? fillGrandma() : tab === "translate" && fillList(); return; }
    const fresh = data.filter(m => !convo.some(c => c.id === m.id));
    if (!fresh.length) return;
    convo = data;
    if (IS_GRANDMA) {
      const incoming = fresh.filter(m => m.direction === "from_grandchild");
      fillGrandma(incoming.length ? incoming[incoming.length - 1].id : null);
    } else {
      const incoming = fresh.filter(m => m.direction === "from_grandparent");
      if (tab === "translate") fillList();
      if (incoming.length) toast(`New voice note from ${profile.gp_name} ❤`);
    }
  } catch { /* server restarting */ }
}
setInterval(() => document.querySelectorAll(".statusbar .clock").forEach(c => { const d = new Date(); c.textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`; }), 20000);

window.addEventListener("storage", e => {
  if (e.key === "kebdti.profile" || e.key === "kebdti.words") {
    profile = { ...DEFAULT_PROFILE, ...store.get("profile", {}) }; familyWords = store.get("words", DEFAULT_WORDS);
    if (IS_GRANDMA) renderGrandma(); else if (tab !== "profile") render();
  }
});

(async function init() {
  setupDesktop();
  if (IS_GRANDMA) document.title = "Kebdti · " + profile.gp_name;
  try { convo = await fetch("/api/conversation").then(r => r.json()); } catch { convo = []; }
  if (IS_GRANDMA && !seen.size) convo.forEach(m => seen.add(m.id));
  render();
  setInterval(poll, 3000);
})();
