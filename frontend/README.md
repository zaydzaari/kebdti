# Kebdti app (frontend)

Next.js app for both phones:
- `/` is the grandchild's app: talking with, family inbox, auto language detection, voice set-up, phrases and profile.
- `/grandma` and `/grandpa` are the grandparent's phone: one big record button, and messages that play by themselves in Darija.

```bash
npm ci
KEBDTI_PIPELINE_URL=http://127.0.0.1:8000 npm run dev   # the backend must be running (see ../backend)
npm test                                                # 17 flow tests, in sample mode
python scripts/e2e_live.py http://localhost:3000        # live two-phone test with fake microphones
```

Accounts use a small in-memory test backend (`app/api/test`), so use made-up details. Translations, voices and the family conversation are real and come from the pipeline in `../backend`.
