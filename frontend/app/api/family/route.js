// The family's shared conversation, kept by the Kebdti pipeline.
//   GET /api/family            every recent message
//   GET /api/family?a=X&b=Y    only the messages between family members X and Y
import { PIPELINE_URL } from '../../lib/kebdti-pipeline.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FEEL = { love: 'affection', longing: 'longing', care: 'care', worry: 'worry', pride: 'pride', blessing: 'blessing',
               humor: 'humour', gratitude: 'gratitude', sadness: 'sadness', neutral: 'everyday' };
const ID = /^[a-z0-9-]{1,40}$/;

export async function GET(request) {
  const q = new URL(request.url).searchParams;
  const a = q.get('a') || '', b = q.get('b') || '';
  const pair = ID.test(a) && ID.test(b) ? `?a=${a}&b=${b}` : '';
  try {
    const res = await fetch(`${PIPELINE_URL}/api/conversation${pair}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error();
    const items = (await res.json()).map(m => ({
      id: m.id, at: Math.round((m.at || 0) * 1000), direction: m.direction, source: m.source || 'app',
      fromId: m.from_id || null, toId: m.to_id || null,
      text: m.text || '', original: m.original || '', latin: m.latin || '', lang: m.lang,
      literal: m.word_for_word || '', feelings: (m.feeling || []).map(f => FEEL[f] || f),
      notes: (m.notes || []).map(n => ({ expression: n.expression, literal: n.literal, meaning: n.meaning })),
      unsure: m.confidence === 'low' || (m.notes || []).some(n => String(n.meaning || '').toLowerCase().startsWith('uncertain')),
      cloned: !!m.voice_cloned,
      audioUrl: m.audio_url ? '/api/voice' + m.audio_url.replace(/^\/audio/, '') : null,
    }));
    return Response.json({ ok: true, items }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ ok: false, items: [], message: "Kebdti's translator isn't running." }, { status: 503 });
  }
}
