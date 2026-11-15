import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_NOTE_BYTES, buildShareText, checkReceivedFile, pickRecordingMime, recordingFileName, whatsappUrl } from '../app/lib/share.js';

test('share text labels samples and never claims a recording for them', () => {
  const sample = buildShareText({ mock: true, translation: 'Mon cœur', translit: '', note: 'A note' });
  assert.match(sample, /^\[Test sample\]\n\nMon cœur\n\nA note\n\n/);
  assert.match(sample, /not a translation of a recording\.$/);
  const real = buildShareText({ mock: false, translation: 'كبدتي', translit: 'kebdti', note: '' });
  assert.equal(real, 'كبدتي\n\nkebdti\n\nTranslated by AI with Kebdti.');
});

test('the WhatsApp link carries Arabic text and line breaks intact', () => {
  const text = 'كبدتي، توحشتك بزاف\n\nkebdti & co?';
  const url = new URL(whatsappUrl(text));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.searchParams.get('text'), text);
});

test('recording prefers a format WhatsApp accepts, then falls back', () => {
  assert.equal(pickRecordingMime(() => true), 'audio/mp4');
  assert.equal(pickRecordingMime(type => type.startsWith('audio/webm')), 'audio/webm;codecs=opus');
  assert.equal(pickRecordingMime(type => type === 'audio/webm'), 'audio/webm');
  assert.equal(pickRecordingMime(() => false), '');
  assert.equal(pickRecordingMime(undefined), '');
  assert.equal(pickRecordingMime(() => { throw new Error('unsupported'); }), '');
});

test('shared file names follow the real recording type', () => {
  assert.equal(recordingFileName('audio/mp4'), 'kebdti-voice-note.m4a');
  assert.equal(recordingFileName('audio/mp4;codecs=mp4a.40.2'), 'kebdti-voice-note.m4a');
  assert.equal(recordingFileName('audio/ogg;codecs=opus'), 'kebdti-voice-note.ogg');
  assert.equal(recordingFileName('audio/webm;codecs=opus'), 'kebdti-voice-note.webm');
  assert.equal(recordingFileName(''), 'kebdti-voice-note.webm');
});

test('received files must be audio, non-empty and at most 25 MB', () => {
  assert.equal(checkReceivedFile({ name: 'PTT-WA0003.opus', type: '', size: 4000 }), '');
  assert.equal(checkReceivedFile({ name: 'note', type: 'audio/mp4', size: MAX_NOTE_BYTES }), '');
  assert.match(checkReceivedFile({ name: 'photo.jpg', type: 'image/jpeg', size: 4000 }), /isn't a voice note/);
  assert.match(checkReceivedFile({ name: 'long.m4a', type: 'audio/mp4', size: MAX_NOTE_BYTES + 1 }), /larger than 25 MB/);
  assert.match(checkReceivedFile({ name: 'empty.ogg', type: 'audio/ogg', size: 0 }), /empty/);
  assert.match(checkReceivedFile(null), /No file/);
});
