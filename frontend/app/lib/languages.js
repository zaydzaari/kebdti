// The languages Kebdti can hear and speak. Shared by the screen and the API.
// Darija first, then the languages of the biggest Moroccan diaspora countries.

export const LANGUAGES = [
  {
    code: "dar",
    label: "Darija",
    english: "Moroccan Arabic",
    hint: "Darija",
    badge: "MA",
    prompt: "Moroccan Darija (Moroccan Arabic dialect, not Modern Standard Arabic)",
    tts: "ar-MA",
    whisper: "ar", // Whisper has no Darija code
    asrPrompt:
      "Darija marocaine. سلام، واش كتسمعني؟ كيداير؟ لاباس؟ كبدتي، توحشتك بزاف، الله يرضي عليك، أوليدي، فين غادي تجي؟ واش كليتي؟",
  },
  { code: "fr", label: "Français", english: "French", hint: "French", badge: "FR", prompt: "French", tts: "fr-FR", whisper: "fr" },
  { code: "en", label: "English", english: "English", hint: "English", badge: "EN", prompt: "English", tts: "en-US", whisper: "en" },
  { code: "es", label: "Español", english: "Spanish", hint: "Spanish", badge: "ES", prompt: "Spanish", tts: "es-ES", whisper: "es" },
  { code: "nl", label: "Nederlands", english: "Dutch", hint: "Dutch", badge: "NL", prompt: "Dutch", tts: "nl-NL", whisper: "nl" },
  { code: "de", label: "Deutsch", english: "German", hint: "German", badge: "DE", prompt: "German", tts: "de-DE", whisper: "de" },
  { code: "it", label: "Italiano", english: "Italian", hint: "Italian", badge: "IT", prompt: "Italian", tts: "it-IT", whisper: "it" },
  { code: "ar", label: "العربية", english: "Standard Arabic", hint: "Arabic", badge: "AR", prompt: "Modern Standard Arabic", tts: "ar-SA", whisper: "ar" },
];

export const LANG = Object.fromEntries(LANGUAGES.map((l) => [l.code, l]));

// Who reads the culture note and feeling words: the side that is NOT Darija
// (the grandmother can't read, and the note explains Darija to the other person).
export function explainCode(from, to) {
  if (from === "dar") return to;
  if (to === "dar") return from;
  return to;
}

// Live translation (speech recognition + GPT-6 Luna + voice) is tested for Darija with these four languages.
export const LIVE_CODES = ["dar", "fr", "es", "it", "en"];

// Kebdti always translates to or from Darija. Picking a non-Darija language on one side puts Darija on the other.
export function safePair(from, to) {
  if (from === to) return to === "dar" ? { from, to: "en" } : { from: "dar", to };
  if (from !== "dar" && to !== "dar") return { from, to: "dar" };
  return { from, to };
}
