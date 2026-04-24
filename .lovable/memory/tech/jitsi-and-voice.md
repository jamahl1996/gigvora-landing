---
name: Jitsi + Voice/Video Standard
description: Free Jitsi Meet is the default voice/video provider; voice notes use MediaRecorder + local-first storage.
type: feature
---

ALL voice and video activity (calls, video calls, podcasts, webinars, voice notes
in messages, live rooms) MUST go through the Jitsi adapter at
`apps/integrations/src/voice/jitsi.ts` and the `<JitsiRoom />` component at
`src/components/voice/JitsiRoom.tsx`. Default domain is `meet.jit.si` (free, no key).
Self-hosted Jitsi is configured via `JITSI_DOMAIN` env. Do NOT bring in paid
SDKs (Twilio Video, Daily, Zoom) unless the user explicitly asks.

Voice notes use `<VoiceNoteRecorder />` which records via MediaRecorder and
writes to IndexedDB through `src/lib/storage/localFirst.ts` BEFORE any remote
sync. Provider tier ordering for any future paid escalation: Jitsi → LiveKit
self-hosted → Twilio.

This rule is mandatory for every Domain pack going forward (podcasts,
webinars, shorts, long videos, calls, inbox).
