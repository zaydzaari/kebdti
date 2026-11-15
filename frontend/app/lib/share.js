// Sending a note to family. Pure helpers so they can be unit-tested.
// Kebdti can send the translation as text and, for real recordings, the original audio.
// It never claims to send a translated voice: that needs the backend (see docs/PROPOSALS-FOR-BACKEND.md).

// The message text for a translation result. Samples are always labelled.
export function buildShareText(result) {
  const lines = [result.translation, result.translit, result.note].filter(Boolean);
  const head = result.mock ? "[Test sample]\n\n" : "";
  const foot = result.mock
    ? "Kebdti interface test. This is not a translation of a recording."
    : "Translated by AI with Kebdti.";
  return `${head}${lines.join("\n\n")}\n\n${foot}`;
}

// Opens WhatsApp (app on phones, WhatsApp Web on computers) with the text ready to send.
export function whatsappUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

// WhatsApp accepts .m4a and .ogg voice files but not .webm, so prefer mp4 when the browser can record it.
const RECORDING_MIMES = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"];
export function pickRecordingMime(isTypeSupported) {
  if (typeof isTypeSupported !== "function") return "";
  for (const mime of RECORDING_MIMES) {
    try {
      if (isTypeSupported(mime)) return mime;
    } catch (_) {
      // keep looking
    }
  }
  return "";
}

export function recordingFileName(mime = "") {
  const type = String(mime).toLowerCase();
  if (type.startsWith("audio/mp4") || type.startsWith("audio/m4a") || type.startsWith("audio/aac")) return "kebdti-voice-note.m4a";
  if (type.startsWith("audio/ogg") || type.startsWith("audio/opus")) return "kebdti-voice-note.ogg";
  if (type.startsWith("audio/mpeg")) return "kebdti-voice-note.mp3";
  if (type.startsWith("audio/wav") || type.startsWith("audio/x-wav")) return "kebdti-voice-note.wav";
  return "kebdti-voice-note.webm";
}

// A voice note the user received and wants to understand (for example one saved from WhatsApp).
export const MAX_NOTE_BYTES = 25 * 1024 * 1024;
const AUDIO_EXTENSIONS = /\.(opus|ogg|oga|m4a|mp3|wav|webm|aac|amr|3gp|mp4)$/i;
export function checkReceivedFile(file) {
  if (!file) return "No file was chosen.";
  const audio = (file.type || "").startsWith("audio/") || AUDIO_EXTENSIONS.test(file.name || "");
  if (!audio) return "That file isn't a voice note. Choose an audio file, such as one saved from WhatsApp.";
  if (file.size > MAX_NOTE_BYTES) return "That voice note is larger than 25 MB. Choose a shorter one.";
  if (!file.size) return "That file is empty. Choose another voice note.";
  return "";
}
