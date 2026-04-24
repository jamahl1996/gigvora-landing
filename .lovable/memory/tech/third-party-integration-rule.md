---
name: Package + Third-party Integration Rule
description: Every domain pack must enumerate npm deps + 3rd-party providers; default to free OSS (Jitsi, local storage, native Web APIs).
type: feature
---

Every Domain pack MUST end with an explicit "3rd-party + packages" map
covering: voice/video provider (default Jitsi), storage backend (default
local-first → S3/R2 opt-in), ML/analytics endpoints, payment provider,
realtime transport (Socket.IO), and any npm packages added.

Defaults that MUST be honoured unless the user opts out:
- Voice/Video: Jitsi Meet (free, OSS)
- Storage: Local-first IndexedDB / virtual FS, S3/R2 opt-in
- Realtime: Socket.IO via NotificationsGateway
- HLS: `hls.js` (lazy-loaded only on long-form / webinar surfaces)
- Voice capture: native MediaRecorder (no SDK dep)

Paid SDKs (Twilio, Daily, Zoom, Mux) are forbidden defaults — they may
only be added on explicit user request.
