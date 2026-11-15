"""A-to-Z check of the running Kebdti system (Python pipeline on :8000, Next app on :3001).

Run:  .venv/Scripts/python -X utf8 eval/check_az.py
It calls every route the app uses, including error cases, and prints one line per check.
Cost: a few ElevenLabs characters and a few cents of Luna at most (voices are cached).
"""
import json
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
import os
PY, NX = "http://127.0.0.1:8000", os.environ.get("KEBDTI_URL", "http://127.0.0.1:3001").rstrip("/")
results = []


def check(name, fn):
    t0 = time.time()
    try:
        ok, info = fn()
    except Exception as e:
        ok, info = False, f"EXCEPTION {str(e)[:120]}"
    results.append(bool(ok))
    print(f"{'✅' if ok else '❌'} {name:58s} {time.time() - t0:5.1f}s  {info}")


def http(url, method="GET", body=None, headers=None, raw=False, timeout=240):
    req = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read()
            return r.status, (data if raw else json.loads(data or b"{}")), dict(r.headers)
    except urllib.error.HTTPError as e:
        data = e.read()
        try:
            return e.code, (data if raw else json.loads(data or b"{}")), dict(e.headers)
        except Exception:
            return e.code, data, dict(e.headers)


def form(url, fields, audio=None):
    fields = {"test": "1", **fields}
    b = uuid.uuid4().hex
    parts = [f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode() for k, v in fields.items()]
    if audio:
        parts.append(f'--{b}\r\nContent-Disposition: form-data; name="audio"; filename="n.wav"\r\nContent-Type: audio/wav\r\n\r\n'.encode() + audio + b"\r\n")
    parts.append(f"--{b}--\r\n".encode())
    return http(url, "POST", b"".join(parts), {"Content-Type": f"multipart/form-data; boundary={b}"})


T = NX + "/api/test/translate"
grandma_voice = (ROOT / "data/audio/grandma_wav/PTT-20261026-WA0020.wav").read_bytes()
silence = (ROOT / "data/audio/grandma_wav/PTT-20261026-WA0020.wav").read_bytes()[:3000]  # header + a few ms only

print("=== Pages")
for path in ["/", "/grandma", "/grandpa", "/this-page-does-not-exist"]:
    check(f"page {path}", lambda p=path: (lambda s: (s[0] == (404 if "does-not" in p else 200), f"HTTP {s[0]}"))(http(NX + p, raw=True)))

print("=== Family")
check("members list (4 people, both elders + both kids)", lambda: (lambda s: (s[0] == 200 and {m['id'] for m in s[1]['members']} >= {'fatna', 'ahmed', 'yanis', 'lina'}, f"{len(s[1]['members'])} members"))(http(NX + "/api/family/members")))
check("add relative: missing name is refused", lambda: (lambda s: (s[0] == 400, f"HTTP {s[0]} {s[1].get('message', '')[:50]}"))(http(NX + "/api/family/members", "PUT", json.dumps({"name": "", "role": "grandson"}).encode(), {"Content-Type": "application/json"})))
check("add relative: unknown role is refused", lambda: (lambda s: (s[0] == 400, f"HTTP {s[0]}"))(http(NX + "/api/family/members", "PUT", json.dumps({"name": "X", "role": "uncle"}).encode(), {"Content-Type": "application/json"})))


def add_remove():
    s = http(NX + "/api/family/members", "PUT", json.dumps({"name": "Test Cousin", "role": "granddaughter", "lang": "it"}).encode(), {"Content-Type": "application/json"})
    mid = s[1]["member"]["id"]
    d = http(NX + f"/api/family/members?id={mid}", "DELETE")
    return s[0] == 200 and d[0] == 200 and all(m["id"] != mid for m in d[1]["members"]), f"added+removed {mid}"


check("add then remove a relative", add_remove)
check("remove with a bad id is refused", lambda: (lambda s: (s[0] == 400, f"HTTP {s[0]}"))(http(NX + "/api/family/members?id=../../etc", "DELETE")))
check("pair filter returns only that pair", lambda: (lambda s: (s[0] == 200 and all({m['fromId'], m['toId']} == {'fatna', 'yanis'} for m in s[1]['items']), f"{len(s[1]['items'])} messages"))(http(NX + "/api/family?a=fatna&b=yanis")))
check("test messages never reach the family", lambda: (lambda s: (s[0] == 200 and not any(m.get("test") for m in s[1]["items"]), f"{len(s[1]['items'])} real messages"))(http(NX + "/api/family")))

print("=== Translation routes (live)")


def route(fields, audio=None, expect_cloned=None, expect_lang=None):
    def run():
        s = form(T, fields, audio)
        r = s[1]
        ok = s[0] == 200 and r.get("ok") and r.get("translation") and r.get("audioUrl")
        if r.get("audioUrl"):
            AUDIO_SEEN.append(r["audioUrl"])
        if expect_cloned is not None:
            ok = ok and r.get("cloned") == expect_cloned
        return ok, f"cloned={r.get('cloned')} | {(r.get('translation') or r.get('message') or '')[:60]}"
    return run


AUDIO_SEEN = []
check("Grandma voice  -> Yanis EN (her clone)", route({"from": "dar", "to": "en", "source": "grandma", "from_id": "fatna", "to_id": "yanis", "family": "[]"}, grandma_voice, True))
check("Grandma voice  -> Lina ES (her clone)", route({"from": "dar", "to": "es", "source": "grandma", "from_id": "fatna", "to_id": "lina", "family": "[]"}, grandma_voice, True))
check("Grandma typed  -> IT", route({"from": "dar", "to": "it", "source": "translate", "family": "[]", "text": "الله يرضي عليك أ وليدي"}, None, True))
check("Grandma typed  -> FR", route({"from": "dar", "to": "fr", "source": "translate", "family": "[]", "text": "توحشتك بزاف أ كبدتي"}, None, True))
check("Grandma typed  -> NL (Dutch)", route({"from": "dar", "to": "nl", "source": "translate", "family": "[]", "text": "الله يحفظك أ كبدتي، فوقاش غادي تجي؟"}, None, True))
check("Grandma typed  -> DE (German)", route({"from": "dar", "to": "de", "source": "translate", "family": "[]", "text": "توحشتك بزاف أ وليدي، الله يرضي عليك"}, None, True))
check("Grandma typed  -> AR (Standard Arabic)", route({"from": "dar", "to": "ar", "source": "translate", "family": "[]", "text": "أ كبدتي، الدار خاوية بلا بيك"}, None, True))
check("Grandpa voice  -> Yanis FR (male voice, not cloned)", route({"from": "dar", "to": "fr", "source": "grandma", "from_id": "ahmed", "to_id": "yanis", "family": "[]"}, grandma_voice, False))
YANIS_VOICE = bool(http(NX + "/api/myvoice/yanis")[1].get("ready"))
check(f"Yanis typed FR -> Grandma ({'his own voice, set up once' if YANIS_VOICE else 'no voice set up: standard voice'})",
      route({"from": "fr", "to": "dar", "source": "translate", "from_id": "yanis", "to_id": "fatna", "consent": "0", "family": "[]", "text": "Mamie, je t'aime."}, None, YANIS_VOICE))
check("Grandchild typed DE -> Grandma", route({"from": "de", "to": "dar", "source": "translate", "family": "[]", "text": "Oma, ich habe die Prüfung bestanden!"}, None, None))
check("Grandchild typed NL -> Grandma", route({"from": "nl", "to": "dar", "source": "translate", "family": "[]", "text": "Oma, ik mis je heel erg."}, None, None))
check("Grandchild typed AR (Standard Arabic) -> Grandma", route({"from": "ar", "to": "dar", "source": "translate", "family": "[]", "text": "جدتي العزيزة، اشتقت إليك كثيرا وسأزورك في الصيف."}, None, None))
check("Lina typed ES  -> Grandpa", route({"from": "es", "to": "dar", "source": "translate", "from_id": "lina", "to_id": "ahmed", "consent": "0", "family": "[]", "text": "Abuelo, ¿cómo estás?"}, None, False))
check("family words reach the translator", route({"from": "dar", "to": "en", "source": "translate", "family": json.dumps([{"id": "1", "word": "a l9mer", "meaning": "my moon: the nickname grandma uses for me"}]), "text": "أ القمر ديالي، فين غبرتي؟"}))

print("=== Auto-detect (nobody picks a language)")


def auto(fields, audio=None, want_from=None, want_to=None):
    def run():
        s = form(T, {"auto": "1", "source": "translate", "family": "[]", **fields}, audio)
        r = s[1]
        ok = s[0] == 200 and r.get("ok") and r.get("translation") and r.get("from") == want_from and r.get("to") == want_to
        return ok, f"heard {r.get('from')} -> {r.get('to')} | {(r.get('translation') or r.get('message') or '')[:55]}"
    return run


check("Grandma speaks (as Fatna to Yanis)  -> Darija found, EN", auto({"me_id": "fatna", "with_id": "yanis"}, grandma_voice, "dar", "en"))
check("Yanis types Italian                 -> it, to Darija", auto({"me_id": "yanis", "with_id": "fatna", "text": "Ciao nonna, mi senti?"}, None, "it", "dar"))
check("Yanis types German                  -> de, to Darija", auto({"me_id": "yanis", "with_id": "fatna", "text": "Hallo Oma, wie geht es dir? Ich vermisse dich."}, None, "de", "dar"))
check("Yanis types Dutch                   -> nl, to Darija", auto({"me_id": "yanis", "with_id": "fatna", "text": "Hoi oma, hoe gaat het met je? Ik mis je."}, None, "nl", "dar"))
check("Lina types English to Grandpa       -> en, to Darija", auto({"me_id": "lina", "with_id": "ahmed", "text": "Grandpa, I passed my exam!"}, None, "en", "dar"))
check("Portuguese is refused, clearly", lambda: (lambda s: (s[0] == 400 and "understands" in s[1].get("message", ""), s[1].get("message", "")[:70]))(form(T, {"auto": "1", "me_id": "yanis", "with_id": "fatna", "text": "Olá avó, como você está? Tenho muitas saudades de você."})))

print("=== Own voice set-up (15-30 s)")
check("voice status answers", lambda: (lambda s: (s[0] == 200 and "ready" in s[1], f"yanis ready={s[1].get('ready')}"))(http(NX + "/api/myvoice/yanis")))
check("a 5 s recording is refused (needs 15 s)", lambda: (lambda s: (s[0] == 400 and "15 seconds" in s[1].get("message", ""), s[1].get("message", "")[:70]))(form(NX + "/api/myvoice/lina", {}, (ROOT / "data/samples/grandchild_test_en.wav").read_bytes())))
check("no recording is refused", lambda: (lambda s: (s[0] == 400, f"HTTP {s[0]}"))(form(NX + "/api/myvoice/lina", {"x": "1"})))
check("unknown person is refused", lambda: (lambda s: (s[0] in (400, 404), f"HTTP {s[0]}"))(http(NX + "/api/myvoice/nobody-here")))

print("=== Error cases (must be clear messages, never a crash)")
check("same language on both sides", lambda: (lambda s: (s[0] == 400 and s[1].get("message"), s[1].get("message", "")[:70]))(form(T, {"from": "fr", "to": "fr", "text": "x"})))
check("no Darija on either side", lambda: (lambda s: (s[0] == 400 and s[1].get("message"), s[1].get("message", "")[:70]))(form(T, {"from": "fr", "to": "en", "text": "x"})))
check("language not live yet (Portuguese)", lambda: (lambda s: (s[0] == 400 and s[1].get("message"), s[1].get("message", "")[:70]))(form(T, {"from": "pt", "to": "dar", "text": "x"})))
check("empty message, no audio -> authored sample (demo)", lambda: (lambda s: (s[0] == 200 and s[1].get("mock") is True, f"mock={s[1].get('mock')}"))(form(T, {"from": "dar", "to": "fr"})))
check("0.1 s of audio -> 'unclear', no invented text", lambda: (lambda s: (s[0] == 200 and s[1].get("unclear") is True, f"unclear={s[1].get('unclear')}"))(form(T, {"from": "dar", "to": "fr", "source": "grandma", "family": "[]"}, silence)))

quiet = (ROOT / "data/samples/silence_2s.wav").read_bytes()
check("2 s of silence (quiet room) -> 'unclear', no invented text", lambda: (lambda s: (s[0] == 200 and s[1].get("unclear") is True, f"unclear={s[1].get('unclear')}"))(form(T, {"from": "dar", "to": "fr", "source": "grandma", "family": "[]"}, quiet)))
check("grandchild silent recording -> 'unclear'", lambda: (lambda s: (s[0] == 200 and s[1].get("unclear") is True, f"unclear={s[1].get('unclear')}"))(form(T, {"from": "fr", "to": "dar", "source": "translate", "family": "[]"}, quiet)))

print("=== Voice files")




def voice_ok():
    urls = AUDIO_SEEN[-6:]
    bad = []
    for u in urls:
        s = http(NX + u, raw=True)
        r = http(NX + u, headers={"Range": "bytes=0-99"}, raw=True)
        if s[0] != 200 or r[0] != 206 or len(r[1]) != 100:
            bad.append((u, s[0], r[0]))
    return not bad, f"{len(urls)} files checked (full + range){'; bad: ' + str(bad) if bad else ''}"


check("recent voice files play (full + range requests)", voice_ok)
check("missing voice file -> 404, not a crash", lambda: (lambda s: (s[0] == 404, f"HTTP {s[0]}"))(http(NX + "/api/voice/cache/nope.wav", raw=True)))
check("path tricks are refused", lambda: (lambda s: (s[0] in (400, 404), f"HTTP {s[0]}"))(http(NX + "/api/voice/..%2F..%2F.env", raw=True)))

print("=== Phrase book voice (grandma, Darija)")
check("speak a phrase in grandma's Darija voice", lambda: (lambda s: (s[0] == 200 and s[1].get("cloned"), f"cloned={s[1].get('cloned')}"))(http(NX + "/api/speak", "POST", json.dumps({"text": "أ كبدتي"}).encode(), {"Content-Type": "application/json"})))

print(f"\n{sum(results)}/{len(results)} checks passed")
