"""Gemini through Google AI Studio with several free-tier keys.

The free tier of gemini-3.8-flash allows only ~20 requests per day per project, so we rotate:
put all your keys in .env as  GEMINI_API_KEYS=key1,key2,key3  (GEMINI_API_KEY is also used).
When a key answers 429 (quota) it is skipped for the rest of the run. If every key is exhausted
and ZenMux fallback is allowed, the call goes to ZenMux (google/gemini-3.8-flash, paid).
"""
import os
import threading
import time
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
GOOGLE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"


def _keys():
    ks = [k.strip() for k in os.environ.get("GEMINI_API_KEYS", "").split(",") if k.strip()]
    if os.environ.get("GEMINI_API_KEY") and os.environ["GEMINI_API_KEY"] not in ks:
        ks.append(os.environ["GEMINI_API_KEY"])
    return ks


class GeminiPool:
    def __init__(self, model="gemini-3.8-flash", zenmux_fallback=False, effort="low"):
        self.model, self.effort, self.fallback = model, effort, zenmux_fallback
        self.clients = [OpenAI(base_url=GOOGLE_URL, api_key=k, timeout=120, max_retries=0) for k in _keys()]
        self.dead = set()
        self.i = 0
        self.lock = threading.Lock()
        self.zen = OpenAI(base_url="https://zenmux.ai/api/v1", api_key=os.environ["ZENMUX_API_KEY"], timeout=120, max_retries=1) if zenmux_fallback else None
        self.used = {"google": 0, "zenmux": 0}

    def _next(self):
        with self.lock:
            alive = [j for j in range(len(self.clients)) if j not in self.dead]
            if not alive:
                return None
            self.i = (self.i + 1) % len(self.clients)
            while self.i in self.dead:
                self.i = (self.i + 1) % len(self.clients)
            return self.i

    def chat(self, messages, max_tokens=4000, temperature=0.3, attempts=None):
        kw = dict(messages=messages, max_tokens=max_tokens, temperature=temperature, reasoning_effort=self.effort)
        attempts = attempts or len(self.clients) * 4 + 4
        for k in range(attempts):
            j = self._next()
            if j is None:
                break
            t0 = time.time()
            try:
                r = self.clients[j].chat.completions.create(model=self.model, **kw)
                self.used["google"] += 1
                return dict(text=r.choices[0].message.content, latency=round(time.time() - t0, 2), cost=0.0, via=f"google#{j}")
            except Exception as e:
                s = str(e)
                if "429" in s:
                    self.dead.add(j)       # daily quota for this key is gone
                elif "503" in s or "timed out" in s.lower() or "500" in s or "overloaded" in s.lower():
                    time.sleep(min(5 + 5 * k, 30))  # overloaded: back off, then try another key
                else:
                    raise
        if self.zen is None:
            raise RuntimeError("all Google keys exhausted/overloaded and ZenMux fallback is off")
        t0 = time.time()
        r = self.zen.chat.completions.create(model="google/" + self.model, **kw)
        self.used["zenmux"] += 1
        u = r.usage
        return dict(text=r.choices[0].message.content, latency=round(time.time() - t0, 2),
                    cost=float(getattr(u, "cost", 0) or 0), via="zenmux")
