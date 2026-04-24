---
name: Local-first Storage (default) → S3/R2 promotion
description: All uploads/persistence default to local (IndexedDB / Worker FS); S3 or Cloudflare R2 are opt-in promotion targets.
type: feature
---

Storage hierarchy for the entire site (audio, video, images, attachments,
voice notes, podcast episodes, webinar recordings, profile assets):

1. **Local-first (default)** — `src/lib/storage/localFirst.ts` (IndexedDB)
   on the client; `apps/integrations/src/storage/local.ts` on the server.
   Every upload lands here FIRST so previews + offline never break.
2. **Promotion** — when `STORAGE_BACKEND=s3` or `=r2` and the matching
   connection is configured, a background sync job promotes blobs to the
   remote backend and rewrites the resolved URL.
3. **Adapters** — `apps/integrations/src/storage/{s3,r2,local}.ts` share
   the same contract; call-sites import from `local.ts` regardless.

Never bypass local-first by uploading directly to a remote bucket. Never
default to S3/R2 — they are explicit opt-ins.
