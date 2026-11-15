// Bridge to the real Kebdti pipeline (Python, ../app/server.py, default http://127.0.0.1:8000):
//   speech recognition (Gemini) -> feeling-aware translation (GPT-6 Luna, prompt v4.3) -> voice (Gemini TTS).
// Accounts, profile and history stay on the local test backend; only translation is real.
// Set NEXT_PUBLIC_TRANSLATE_MODE=sample to go back to authored samples.

export const PIPELINE_URL = (process.env.KEBDTI_PIPELINE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
export const LIVE_TRANSLATE = process.env.NEXT_PUBLIC_TRANSLATE_MODE !== 'sample';
const SUPPORTED = ['fr', 'es', 'it', 'en'];
const FEEL = { love: 'affection', longing: 'longing', care: 'care', worry: 'worry', pride: 'pride', blessing: 'blessing',
               humor: 'humour', gratitude: 'gratitude', sadness: 'sadness', neutral: 'everyday' };

class PipelineError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }

function familyWords(raw) {
  try {
    const list = JSON.parse(raw || '[]');
    return Array.isArray(list) ? list.slice(0, 30).map(w => ({ expression: String(w.word || w.expression || ''), meaning: String(w.meaning || '') })).filter(w => w.expression && w.meaning) : [];
  } catch { return []; }
}

async function callPipeline(endpoint, body) {
  let res;
  try { res = await fetch(PIPELINE_URL + endpoint, { method: 'POST', body, cache: 'no-store', signal: AbortSignal.timeout(120000) }); }
  catch (e) {
    if (e?.name === 'TimeoutError') throw new PipelineError(504, 'PIPELINE_TIMEOUT', 'That took too long. Try a shorter voice note, or try again in a moment.');
    console.error(`[kebdti] translator unreachable at ${PIPELINE_URL}. Start it: uvicorn app.server:app --port 8000`);
    throw new PipelineError(503, 'PIPELINE_OFFLINE', "Kebdti's translator is offline right now. Try again in a moment."); }
  return { res, r: await res.json().catch(() => ({})) };
}

function shape(r, from, to) {
  const voice = r.audio_url ? '/api/voice' + r.audio_url.replace(/^\/audio/, '') : null;
  const feelings = (r.feeling || []).map(f => FEEL[f] || f);
  const base = { ok: true, mock: false, from, to, heard: r.original, translation: r.text, feelings, audioUrl: voice,
                 cloned: !!r.voice_cloned, seconds: r.seconds, direction: r.direction, detected: r.detected || null };
  if (from === 'dar') {
    const notes = r.notes || [];
    const unsure = notes.filter(n => String(n.meaning || '').toLowerCase().startsWith('uncertain'));
    const known = notes.filter(n => !unsure.includes(n));
    let note = known.map(n => `“${n.expression}” literally means “${String(n.literal || '').replace(/[.。]+$/, '')}”: ${n.meaning}`).join('\n');
    if (unsure.length || r.confidence === 'low') note = (note ? note + '\n' : '') + `Kebdti isn't sure about ${unsure.length ? unsure.map(n => `“${n.expression}”`).join(', ') : 'part of this message'}. Ask what they meant.`;
    return { ...base, translit: '', literal: r.word_for_word || '', note, ttsLang: to, unsure: unsure.length > 0 || r.confidence === 'low' };
  }
  return { ...base, translit: r.latin || '', literal: '', note: '', ttsLang: 'ar-MA' };
}

// Auto mode: nobody picks a language. Darija goes to the grandchild, French/Spanish/Italian/English to the grandparent.
async function autoTranslate(form) {
  const audio = form.get('audio'), text = String(form.get('text') || '').trim();
  const hasAudio = audio && typeof audio === 'object' && audio.size > 0;
  if (!hasAudio && !text) return null;
  const body = new FormData();
  if (hasAudio) body.append('audio', audio, audio.name || 'note.wav');
  else body.append('text', text);
  body.append('profile', JSON.stringify({
    me_id: String(form.get('me_id') || '') || undefined, with_id: String(form.get('with_id') || '') || undefined,
    source: String(form.get('source') || 'app'), voice_consent: form.get('consent') === '1',
    voice_owner: String(form.get('owner') || 'grandchild').slice(0, 40), family_words: familyWords(form.get('family')),
    test: form.get('test') === '1' || undefined,
  }));
  const { res, r } = await callPipeline('/api/message', body);
  if (!res.ok || r.error) {
    if (res.status === 400 && /understands/.test(r.error || '')) throw new PipelineError(400, 'LANGUAGE_SOON', r.error);
    if (res.status === 400) return { ok: true, unclear: true, from: 'auto', to: 'auto' };
    throw new PipelineError(res.status >= 500 ? 502 : res.status, 'PIPELINE_ERROR', r.error || 'The translation did not go through. Try again.');
  }
  const fromElder = r.direction === 'from_grandparent';
  const from = fromElder ? 'dar' : (SUPPORTED.includes(r.detected) ? r.detected : (SUPPORTED.includes(r.lang) ? r.lang : 'en'));
  const to = fromElder ? (SUPPORTED.includes(r.lang) ? r.lang : 'en') : 'dar';
  return shape(r, from, to);
}

export async function liveTranslate(form) {
  if (form.get('auto') === '1') return autoTranslate(form);
  const from = String(form.get('from') || ''), to = String(form.get('to') || '');
  if (from === to) throw new PipelineError(400, 'LANGUAGE_PAIR', 'Choose two different languages.');
  if (from !== 'dar' && to !== 'dar') throw new PipelineError(400, 'LANGUAGE_PAIR', 'Kebdti translates between Darija and your family\'s language. Set one side to Darija.');
  const other = from === 'dar' ? to : from;
  if (!SUPPORTED.includes(other)) throw new PipelineError(400, 'LANGUAGE_SOON', 'Kebdti speaks French, Spanish, Italian and English with Darija for now. More languages are coming.');

  const audio = form.get('audio'), text = String(form.get('text') || '').trim();
  const hasAudio = audio && typeof audio === 'object' && audio.size > 0;
  if (!hasAudio && !text) return null; // caller falls back to the authored sample (demo mode)

  const body = new FormData();
  if (hasAudio) body.append('audio', audio, audio.name || 'note.wav');
  else body.append('text', text);
  body.append('profile', JSON.stringify({
    grandparent: 'grandmother', grandchild_lang: other, source: String(form.get('source') || 'app'),
    from_id: String(form.get('from_id') || '') || undefined, to_id: String(form.get('to_id') || '') || undefined,
    voice_consent: form.get('consent') === '1', voice_owner: String(form.get('owner') || 'grandchild').slice(0, 40),
    family_words: familyWords(form.get('family')),
    test: form.get('test') === '1' || undefined,
  }));
  const endpoint = from === 'dar' ? '/api/grandparent' : '/api/grandchild';
  const { res, r } = await callPipeline(endpoint, body);
  if (!res.ok || r.error) {
    if (res.status === 400) return { ok: true, unclear: true, from, to };
    throw new PipelineError(res.status >= 500 ? 502 : res.status, 'PIPELINE_ERROR', r.error || 'The translation did not go through. Try again.');
  }
  return shape(r, from, to);
}
