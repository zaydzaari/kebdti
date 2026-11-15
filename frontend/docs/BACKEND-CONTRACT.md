# Frontend backend contract

The frontend calls `app/lib/backend.js`. Default mode uses `/api/test`. Set `NEXT_PUBLIC_BACKEND_MODE=live` and optionally `NEXT_PUBLIC_API_BASE_URL=/api` to connect the real backend. The test catch-all returns 404 in live mode. Public variables are bundled at build time.

Requests include credentials and disable caching. JSON errors should return `{ message, code }` with an appropriate non-2xx status. Authentication should use HttpOnly cookies, with CSRF protection appropriate to the deployment. A separate-origin backend must configure credentialed CORS and cookie policy; a same-origin proxy is the simplest integration.

| Method | Relative endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | session | — | `{ user, profile }`, both null when signed out |
| POST | auth/register | `{ name, email, password }` | `{ user, profile }` plus session cookie |
| POST | auth/login | `{ email, password }` | `{ user, profile }` plus session cookie |
| POST | auth/logout | — | `{ ok: true }`, clear cookie |
| POST | auth/reset/request | `{ email }` | `{ ok: true }`; test service also exposes `testCode` |
| POST | auth/reset/confirm | `{ email, code, password }` | `{ ok: true }` |
| PUT | profile | Profile below | `{ profile }` |
| GET | notes | — | `{ notes: [] }` |
| POST | notes | Translation result | `{ notes: [] }` including saved result |
| DELETE | notes/:id | — | `{ notes: [] }` after deletion |
| DELETE | data | — | `{ ok: true }`; remove profile/history, retain account |
| POST | translate | Multipart form | Translation result below |

`user` contains `{ id, name, email }`; never return passwords, hashes or session tokens. Profile contains `{ name, role, lang, familyLang, voiceConsent, createdAt? }`. Roles: `grandparent`, `grandchild`, `family`. Language codes: `dar`, `fr`, `en`, `es`, `nl`, `de`, `it`, `ar`. Languages must differ. Consent must be an explicit boolean, never inferred from registration.

Translation multipart fields are `from`, `to`, and `audio` for real recordings. Test mode sends only `from`, `to`, `scenario` and never uploads audio. Scenarios: `success`, `unclear`, `offline`. Match the existing real translation route's result shape; the frontend renders `ok`, `heard`, `translation`, `translit`, `literal`, `note`, `feelings`, `ttsLang`, `from`, `to`, `mock`, and `unclear` as applicable. Saved notes also receive server-owned `id` and `at` (Unix milliseconds). Inspect `app/api/translate/route.js` and `app/lib/test-backend.mjs` for exact current payloads before implementing.

Test responses include `backend: "test"`, and sample results include `mock: true`. Keep these disclosures until real inference is connected. Reset codes displayed in test mode must never be exposed by production auth. Production storage, email delivery, abuse protection, provider credentials, transcription quality and voice cloning remain backend/integration work; the local service does not provide them.
