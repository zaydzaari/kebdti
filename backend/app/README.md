# Kebdti MVP

Grandchild app (design by the team): 4 tabs: Translate, Between us (conversation starters + family expressions), Phrases (phrase book), Profile.
Grandma mode: http://localhost:8000/?grandma=1 (one big mic, big play buttons, no reading needed). Open both windows side by side: messages sync live.
Old two-phone dev page: /static/dev-two-phones.html

Run (from the project folder):

    .venv/Scripts/python -X utf8 -m uvicorn app.server:app --port 8000

Open http://localhost:8000 and allow the microphone. Tap 🎙️ to start recording, tap again to send.

Pipeline (`app/pipeline.py`):
- Speech → text: Gemini 3.8 Flash (audio input) via Straitly; fallback Gemini 3.6 Flash on the free Google keys.
- Translation: GPT-6 Luna via Straitly, prompt v4.3 (`eval/prompts_v4.py`), thinking "low". The family profile (address word, grandchild gender) is passed to the prompt.
- Text → speech: Gemini TTS on the free Google keys (rotating). Prebuilt voices, no cloning yet.

Keys in `.env`: STRAITLY_API_KEY, GEMINI_API_KEYS (comma-separated). Family expressions from 'Between us' are sent to the prompt as a family glossary. Voices are cached in data/audio/cache (never generated twice). Every message is logged to `data/audio/conversation.jsonl`.
