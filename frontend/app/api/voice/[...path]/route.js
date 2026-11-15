// Serves Kebdti's generated voice notes from the Python pipeline, so the browser only talks to this app.
// Audio players need the file size and byte-range support to show the duration and to play reliably.
import { PIPELINE_URL } from '../../../lib/kebdti-pipeline.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cache = new Map(); // small in-memory cache: voice files never change once generated

async function load(path) {
  if (cache.has(path)) return cache.get(path);
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${PIPELINE_URL}/audio/${path}`, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`status ${res.status}`);
      const file = { bytes: new Uint8Array(await res.arrayBuffer()), type: res.headers.get('content-type') || 'audio/wav' };
      if (cache.size > 200) cache.delete(cache.keys().next().value);
      cache.set(path, file);
      return file;
    } catch (e) {
      lastError = e;
      await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function GET(request, { params }) {
  const { path } = await params;
  if (!path?.length || path.some(p => !/^[\w.-]+$/.test(p))) return new Response('Not found', { status: 404 });
  let file;
  try { file = await load(path.join('/')); }
  catch { return new Response('Voice unavailable', { status: 503 }); }
  if (!file) return new Response('Not found', { status: 404 });

  const size = file.bytes.length;
  const headers = { 'Content-Type': file.type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, max-age=86400' };
  const range = request.headers.get('range');
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range);
  if (m) {
    let start = m[1] === '' ? size - Number(m[2]) : Number(m[1]);
    let end = m[1] === '' || m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
    if (Number.isNaN(start) || start < 0) start = 0;
    if (start >= size || end < start) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    return new Response(file.bytes.slice(start, end + 1), {
      status: 206, headers: { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) },
    });
  }
  return new Response(file.bytes, { headers: { ...headers, 'Content-Length': String(size) } });
}
