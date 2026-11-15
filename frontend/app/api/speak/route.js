// Phrase book voice: a Darija phrase spoken in grandma's own (cloned) voice, via the Kebdti pipeline. Cached there.
import { PIPELINE_URL } from '../../lib/kebdti-pipeline.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ message: 'Send JSON.' }, { status: 400 }); }
  const text = String(body.text || '').trim().slice(0, 300);
  if (!text) return Response.json({ message: 'Nothing to say.' }, { status: 400 });
  try {
    const res = await fetch(`${PIPELINE_URL}/api/speak`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(60000),
      body: JSON.stringify({ text, lang: 'darija', speaker: 'grandmother' }),
    });
    const r = await res.json().catch(() => ({}));
    if (!res.ok || !r.audio_url) throw new Error();
    return Response.json({ audioUrl: '/api/voice' + r.audio_url.replace(/^\/audio/, ''), cloned: !!r.cloned });
  } catch {
    return Response.json({ message: 'The voice is unavailable right now.' }, { status: 503 });
  }
}
