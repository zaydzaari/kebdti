// Kebdti translation pipeline.
//
// Request: multipart form { audio, from, to }   (language codes from app/lib/languages.js)
//
// Two interchangeable providers (whichever key is set; Gemini wins if both are):
//   GEMINI_API_KEY → Gemini hears the audio AND translates it, in ONE call.
//   GROQ_API_KEY   → Whisper large-v3 (speech-to-text) → Llama 3.3 70B (translation).
// Both return { heard, translation, translit, literal, feelings[], note }.
//
// Rules:
// - A real recording ALWAYS gets a real translation or an honest error. Never the sample.
// - The canned sample is only used when there is no audio at all (?demo mode).

import { LANG, explainCode } from "../../lib/languages";

export const runtime = "nodejs";

// Starter glossary. Expand it with your recorded dataset (the 120 to 150 phrases).
const GLOSSARY = `
Moroccan grandmother expressions. Translate the FEELING, never word for word:
- "kebdti" / كبدتي (lit. my liver) = my darling, my heart. NEVER "my liver".
- "3iniya" / عينيا (lit. my eyes) = my dear, the apple of my eye.
- "a wlidi" / أوليدي (lit. my little son) = sweetheart, my child (tender, any gender).
- "Lah yrdi 3lik" / الله يرضي عليك (lit. may God be satisfied with you) = I'm so proud of you, God bless you.
- "Lah y7fdek" / الله يحفظك = may God protect you (warm blessing).
- "Lah ykhlik liya" / الله يخليك ليا (lit. may God keep you for me) = I love you so much.
- "twe7chtek bzaf" / توحشتك بزاف = I miss you terribly.
- "wach kliti?" / واش كليتي (lit. have you eaten?) = a caring "are you looking after yourself?".
- "wach katsm3ni?" / واش كتسمعني = can you hear me?
- "salam" / سلام = hi, hello.
`;

const CANNED = {
  "dar-fr": {
    heard: "A kebdti, imta ghadi tji? Lah yrdi 3lik a wlidi.",
    translation: "Mon cœur, quand est-ce que tu viens ? Que Dieu te bénisse, mon petit.",
    translit: "",
    literal: "Ô mon foie, quand vas-tu venir ? Que Dieu soit satisfait de toi, mon petit garçon.",
    feelings: ["Amour", "Manque", "Bénédiction"],
    note: "« kebdti » veut dire littéralement « mon foie ». En darija, le foie est l'endroit où vit l'amour : c'est le mot le plus tendre d'une grand-mère, « mon cœur, mon trésor ».",
  },
  "fr-dar": {
    heard: "Mamie, tu me manques beaucoup, je viens cet été.",
    translation: "يا مي، توحشتك بزاف، غادي نجي فالصيف.",
    translit: "A mi, twe7chtek bzaf, ghadi nji f sif.",
    literal: "",
    feelings: ["Tendresse", "Manque"],
    note: "« twe7chtek » est plus fort qu'un simple « tu me manques » : c'est « je me languis de toi ».",
  },
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const GROQ = "https://api.groq.com/openai/v1";
const GEMINI = "https://generativelanguage.googleapis.com/v1beta/models";

function fail(status, code, message) {
  return Response.json({ ok: false, code, message }, { status });
}

class ProviderError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ---------- shared instructions ----------
function rules(from, to) {
  const S = LANG[from];
  const T = LANG[to];
  const E = LANG[explainCode(from, to)];
  return (
    `You are Kebdti, a translator for families where a Moroccan grandparent and a grandchild abroad don't share a language.\n` +
    `Translate EXACTLY what the speaker said. Never add sentences, names or ideas that were not said. Short input → short output.\n` +
    `Translate the emotion and intent, not the literal words: endearments and blessings must feel the way a native speaker feels them.\n` +
    `Darija may be mixed with French or Spanish words. Treat it as Moroccan Darija, not Modern Standard Arabic.\n` +
    `${GLOSSARY}\n` +
    `Source language: ${S.prompt}. Target language: ${T.prompt}.\n` +
    (to === "dar"
      ? `"translation": the Darija in Arabic script, as Moroccans actually speak it (it will be read aloud).\n` +
        `"translit": the same Darija in Latin letters, Arabizi style with 3, 7, 9.\n`
      : `"translit": always an empty string.\n`) +
    (from === "dar"
      ? `"literal": a strictly word-for-word ${T.prompt} rendering, as a basic machine translator would produce. Empty string if identical to the translation.\n`
      : `"literal": always an empty string.\n`) +
    `"feelings": 1 to 3 items, each 1 to 2 plain words in ${E.prompt}, no emoji.\n` +
    `"note": if the message contains a cultural expression (endearment, blessing, proverb), one or two warm sentences in ${E.prompt} explaining it. Otherwise an empty string.`
  );
}

function shape(from, to, parsed, heard) {
  return {
    ok: true,
    mock: false,
    from,
    to,
    sourceLabel: LANG[from].label,
    targetLabel: LANG[to].label,
    ttsLang: LANG[to].tts,
    heard: (heard || "").trim(),
    translation: (parsed.translation || "").trim(),
    translit: to === "dar" ? (parsed.translit || "").trim() : "",
    literal: from === "dar" ? (parsed.literal || "").trim() : "",
    feelings: Array.isArray(parsed.feelings) ? parsed.feelings.slice(0, 3) : [],
    note: (parsed.note || "").trim(),
  };
}

const isTooShort = (t) => !t || t.replace(/[\s.,!?؟،…-]/g, "").length < 2;

// ---------- Gemini: audio → transcript + translation in one call ----------
async function viaGemini(audio, from, to, key) {
  const S = LANG[from];
  const T = LANG[to];
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const data = Buffer.from(await audio.arrayBuffer()).toString("base64");
  const mime = (audio.type || "audio/wav").split(";")[0];

  const res = await fetch(`${GEMINI}/${model}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: rules(from, to) }] },
      contents: [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: mime, data } },
            {
              text:
                `This is a voice message in ${S.prompt}. First transcribe exactly what is said in "heard"` +
                (from === "dar" ? ` (write the Darija in Arabic script)` : ``) +
                `. If the audio is silent, noise, or you cannot understand it, set "unclear" to true and leave ` +
                `the other fields empty. Never guess. Then translate it into ${T.prompt}.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            unclear: { type: "BOOLEAN" },
            heard: { type: "STRING" },
            translation: { type: "STRING" },
            translit: { type: "STRING" },
            literal: { type: "STRING" },
            feelings: { type: "ARRAY", items: { type: "STRING" } },
            note: { type: "STRING" },
          },
          required: ["unclear", "heard", "translation", "translit", "literal", "feelings", "note"],
        },
      },
    }),
  });

  if (res.status === 400 || res.status === 403) {
    const body = await res.text();
    if (/API key|API_KEY|permission/i.test(body)) {
      throw new ProviderError(401, "bad_key", "Google rejected the Gemini API key. Check GEMINI_API_KEY.");
    }
    throw new Error(`gemini ${res.status}: ${body.slice(0, 200)}`);
  }
  if (res.status === 429) throw new ProviderError(429, "rate_limit", "Gemini's free limit was hit. Wait a minute, then try again.");
  if (!res.ok) throw new Error(`gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);

  const json = await res.json();
  const text = (json.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
  if (!text) throw new Error(`gemini returned no text: ${JSON.stringify(json).slice(0, 200)}`);
  const parsed = JSON.parse(text);
  if (parsed.unclear || isTooShort(parsed.heard)) return { ok: false, unclear: true };
  return shape(from, to, parsed, parsed.heard);
}

// ---------- Groq: Whisper → Llama ----------
async function viaGroq(audio, from, to, key) {
  const S = LANG[from];
  const T = LANG[to];

  const asrForm = new FormData();
  asrForm.append("file", audio, audio.name || "note.wav");
  asrForm.append("model", "whisper-large-v3");
  asrForm.append("language", S.whisper);
  if (S.asrPrompt) asrForm.append("prompt", S.asrPrompt);
  asrForm.append("temperature", "0");
  asrForm.append("response_format", "json");
  const asr = await fetch(`${GROQ}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: asrForm,
  });
  if (asr.status === 401) throw new ProviderError(401, "bad_key", "Groq rejected the API key. Check GROQ_API_KEY.");
  if (asr.status === 429) throw new ProviderError(429, "rate_limit", "Groq's free limit was hit. Wait a minute, then try again.");
  if (!asr.ok) throw new Error(`speech-to-text ${asr.status}: ${(await asr.text()).slice(0, 160)}`);
  const heard = ((await asr.json()).text || "").trim();
  if (isTooShort(heard) || heard === S.asrPrompt) return { ok: false, unclear: true };

  const res = await fetch(`${GROQ}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: rules(from, to) + `\nRespond ONLY with JSON: {"translation","translit","literal","feelings","note"}.`,
        },
        { role: "user", content: `Translate from ${S.prompt} to ${T.prompt}.\nTranscript: "${heard}"` },
      ],
    }),
  });
  if (res.status === 429) throw new ProviderError(429, "rate_limit", "Groq's free limit was hit. Wait a minute, then try again.");
  if (!res.ok) throw new Error(`translation ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const parsed = JSON.parse((await res.json()).choices[0].message.content);
  return shape(from, to, parsed, heard);
}

// ---------- route ----------
export async function POST(request) {
  const ct = request.headers.get("content-type") || "";
  let from = "dar";
  let to = "fr";
  let audio = null;

  if (ct.includes("multipart/form-data")) {
    const form = await request.formData();
    if (LANG[form.get("from")]) from = form.get("from");
    if (LANG[form.get("to")]) to = form.get("to");
    const a = form.get("audio");
    if (a && typeof a !== "string" && a.size > 0) audio = a;
  } else {
    try {
      const body = await request.json();
      if (LANG[body.from]) from = body.from;
      if (LANG[body.to]) to = body.to;
    } catch (_) {}
  }

  if (from === to) return fail(400, "same_language", "Pick two different languages.");

  // No audio → demo mode → the canned sample, clearly flagged.
  if (!audio) {
    await delay(600);
    const key = CANNED[`${from}-${to}`] ? `${from}-${to}` : "dar-fr";
    const [f, t] = key.split("-");
    return Response.json({
      ok: true, mock: true, from: f, to: t,
      sourceLabel: LANG[f].label, targetLabel: LANG[t].label, ttsLang: LANG[t].tts,
      ...CANNED[key],
    });
  }

  const gemini = process.env.GEMINI_API_KEY;
  const groq = process.env.GROQ_API_KEY;
  if (!gemini && !groq) {
    return fail(
      503,
      "needs_key",
      "Real translation is off: no API key. Add GEMINI_API_KEY (or GROQ_API_KEY) to .env.local, then restart npm run dev."
    );
  }

  try {
    const out = gemini ? await viaGemini(audio, from, to, gemini) : await viaGroq(audio, from, to, groq);
    return Response.json({ ...out, provider: gemini ? "gemini" : "groq" });
  } catch (err) {
    if (err instanceof ProviderError) return fail(err.status, err.code, err.message);
    console.error("[kebdti] pipeline error:", err);
    return fail(502, "pipeline_failed", "The translation didn't go through. Check your internet connection, then try again.");
  }
}
