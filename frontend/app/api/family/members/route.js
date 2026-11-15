// Family members (grandma, grandpa, grandchildren), shared by every phone. Kept by the Kebdti pipeline.
//   GET     /api/family/members          list
//   PUT     /api/family/members          add or update one  { id?, name, role, lang?, address? }
//   DELETE  /api/family/members?id=X     remove one
import { PIPELINE_URL } from '../../../lib/kebdti-pipeline.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function forward(path, init) {
  try {
    const res = await fetch(`${PIPELINE_URL}${path}`, { cache: 'no-store', signal: AbortSignal.timeout(10000), ...init });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return Response.json({ message: data.error || 'That change did not go through.' }, { status: res.status });
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ message: "Kebdti's translator is offline right now. Try again in a moment." }, { status: 503 });
  }
}

export async function GET() {
  return forward('/api/family/members');
}

export async function PUT(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ message: 'Send the member as JSON.' }, { status: 400 }); }
  const m = { id: body.id, name: String(body.name || '').slice(0, 40), role: body.role, lang: body.lang, address: body.address };
  return forward('/api/family/members', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) });
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!/^[a-z0-9-]{1,40}$/.test(id)) return Response.json({ message: 'Unknown family member.' }, { status: 400 });
  return forward(`/api/family/members/${id}`, { method: 'DELETE' });
}
