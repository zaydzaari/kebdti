"""Live end-to-end check of Kebdti v2 on two phones (real speech recognition, translation and voices).
Grandma's phone sends a Darija voice note -> it arrives on Yanis's phone in English, in her voice -> Yanis answers by voice
in English (auto-detected) -> it arrives on Grandma's phone in Darija, in his voice. Screenshots at every step.
Microphones are fed from WAV files (designed demo voices, no real person).
python -X utf8 scripts/e2e_live.py [app_url] [shots_dir] [grandma_wav] [boy_wav]"""
import json, sys, time, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

APP = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else "e2e-shots"); OUT.mkdir(parents=True, exist_ok=True)
AUDIO = Path(__file__).resolve().parent / "test-audio"   # designed demo voices (ElevenLabs Voice Design), no real person
G_WAV = Path(sys.argv[3]) if len(sys.argv) > 3 else AUDIO / "note_grandma.wav"
Y_WAV = Path(sys.argv[4]) if len(sys.argv) > 4 else AUDIO / "note_boy.wav"
T0 = time.time()
problems = []


def log(*a):
    print(f"{time.time() - T0:6.1f}s", *a, flush=True)


def phone(p, wav):
    b = p.chromium.launch(channel="chrome", args=["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream",
                                                  f"--use-file-for-fake-audio-capture={wav.as_posix()}%noloop", "--autoplay-policy=no-user-gesture-required"])
    c = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, permissions=["microphone"])
    pg = c.new_page()
    pg.on("console", lambda m: m.type == "error" and problems.append(f"console: {m.text[:200]}"))
    pg.on("pageerror", lambda e: problems.append(f"pageerror: {str(e)[:200]}"))
    return b, pg


def shot(pg, name, full=True):
    pg.screenshot(path=str(OUT / f"{name}.png"), full_page=full)
    log("shot", name)


def wait_for(pg, sel, timeout=150, other=None):
    t = time.time()
    while time.time() - t < timeout:
        if pg.locator(sel).count():
            return True
        (other or pg).wait_for_timeout(300)
    return False


with sync_playwright() as p:
    gb, g = phone(p, G_WAV)
    yb, y = phone(p, Y_WAV)
    y.goto(APP + "/"); y.wait_for_timeout(4500)
    y.get_by_text("Skip", exact=True).first.click(); y.wait_for_timeout(1500)
    y.get_by_text("Skip and start translating").click(); y.wait_for_timeout(5000)
    shot(y, "y1_home")
    g.goto(APP + "/grandma"); g.wait_for_timeout(4000)
    shot(g, "g1_gate", False)
    g.locator(".gm-gate").click(); g.wait_for_timeout(1500)
    shot(g, "g2_home", False)

    g.locator(".gm-mic").click(force=True); log("grandma recording"); g.wait_for_timeout(4000)
    shot(g, "g3_recording", False)
    g.wait_for_timeout(4600); g.locator(".gm-mic").click(force=True); log("grandma sent")
    ok = wait_for(g, ".gm-ok", 150, y); log("grandma delivered", ok)
    if not ok: problems.append("grandma note was not delivered")
    ok = wait_for(y, ".inbox-card", 30, g); log("arrived on Yanis's phone", ok)
    if not ok: problems.append("grandma note did not arrive on Yanis's phone")
    y.evaluate("() => window.scrollTo(0, 0)"); y.wait_for_timeout(1200)
    shot(y, "y2_inbox", False)
    if y.locator(".inbox-toggle").count():
        y.locator(".inbox-toggle").first.click(); y.wait_for_timeout(1200)
    shot(y, "y3_inbox_why")

    # Yanis answers by voice (auto-detect)
    y.get_by_role("button", name="Start recording").first.click(); y.wait_for_timeout(3500)
    shot(y, "y4_recording", False)
    y.wait_for_timeout(4200)
    y.locator(".k-flood button[aria-label]").first.click(force=True); y.wait_for_timeout(1500)
    shot(y, "y5_review", False)
    y.get_by_role("button", name="Translate into").first.click() if y.get_by_role("button", name="Translate into").count() else y.get_by_text("Translate into").first.click()
    log("yanis translating"); y.wait_for_timeout(2500)
    shot(y, "y6_translating", False)
    ok = wait_for(y, ".k-sticker", 150, g); log("yanis result", ok)
    if not ok: problems.append("Yanis's reply did not translate")
    y.wait_for_timeout(2500)
    shot(y, "y7_result")
    ok = wait_for(g, ".gm-msg:not(.is-mine)", 30, y); log("arrived on grandma's phone", ok)
    if not ok: problems.append("Yanis's reply did not arrive on Grandma's phone")
    g.wait_for_timeout(2000)
    shot(g, "g4_received", False)

    # typing, auto-detect: a Spanish line must be refused politely? no: Spanish is supported -> Darija
    y.get_by_role("button", name="New note").first.click() if y.get_by_role("button", name="New note").count() else None
    y.wait_for_timeout(1500)
    if y.locator(".k-typerow-input").count():
        y.locator(".k-typerow-input").fill("Grandma, I passed my driving test today!")
        y.locator(".k-typerow-go").click(); log("typed message sent")
        ok = wait_for(y, ".k-sticker", 120, g); log("typed result", ok)
        if not ok: problems.append("typed message did not translate")
        y.wait_for_timeout(2000); shot(y, "y8_typed_result")
    else:
        problems.append("typing box missing")

    # other tabs
    for name in ("Between us", "Phrases", "Profile"):
        loc = y.locator(f".k-dock [aria-label='{name}'], .k-dock button:has-text('{name}')")
        if loc.count():
            loc.first.click(); y.wait_for_timeout(2200); shot(y, "y9_" + name.replace(" ", "_").lower())
        else:
            problems.append(f"tab {name} not found")
    data = json.loads(urllib.request.urlopen(APP + "/api/family", timeout=20).read())
    log("conversation items:", len(data.get("items", [])))
    for m in data.get("items", [])[-4:]:
        log(" ", m.get("direction"), "|", m.get("original"), "=>", m.get("text"), "| cloned", m.get("cloned"))
    gb.close(); yb.close()
print("PROBLEMS:", json.dumps(problems, indent=1, ensure_ascii=False) if problems else "none")
