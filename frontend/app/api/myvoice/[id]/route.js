// A family member's own voice, set up once from a 15-30 s recording. Kept privately by the Kebdti pipeline.
//   GET    /api/myvoice/:id   { ready, seconds, at }
//   POST   /api/myvoice/:id   multipart { audio }  -> learns the voice (recording it is the person's consent)
//   DELETE /api/myvoice/:id   forgets the voice
import { PIPELINE_URL } from '../../../lib/kebdti-pipeline.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OFFLINE = "Kebdti's translator is offline right now. Try again in a moment.";

async function forward(id, init, timeout = 10000) {
  if (!/^[a-z0-9-]{1,40}$/.test(id || '')) return Response.json({ message: 'Unknown family member.' }, { status: 400 });
  try {
    const res = await fetch(`${PIPELINE_URL}/api/voice-profile/${id}`, { cache: 'no-store', signal: AbortSignal.timeout(timeout), ...init });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return Response.json({ message: data.error || 'That did not go through. Try again.' }, { status: res.status });
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    const slow = e?.name === 'TimeoutError';
    return Response.json({ message: slow ? 'That took too long. Try again in a moment.' : OFFLINE }, { status: slow ? 504 : 503 });
  }
}

export async function GET(_request, { params }) {
  const { id } = await params;
  return forward(id);
}

export async function POST(request, { params }) {
  const { id } = await params;
  if (Number(request.headers.get('content-length') || 0) > 8 * 1024 * 1024) return Response.json({ message: 'Use a recording shorter than 30 seconds.' }, { status: 413 });
  let audio;
  try { audio = (await request.formData()).get('audio'); } catch { audio = null; }
  if (!audio || typeof audio !== 'object' || !audio.size) return Response.json({ message: 'Record your voice first.' }, { status: 400 });
  const body = new FormData();
  body.append('audio', audio, audio.name || 'voice.webm');
  return forward(id, { method: 'POST', body }, 90000);
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  return forward(id, { method: 'DELETE' });
}
