---
name: Video Viewer SDK + Hover Preview
description: Single VideoViewer component covers shorts/long/webinars; hover plays silent slices; thumbnails are scene-picked or user-uploaded.
type: feature
---

All video surfaces (shorts, reels, long-form, webinars, replays) MUST render
through `src/components/media/VideoViewer.tsx`. It supports HLS (lazy `hls.js`),
shorts auto-play in viewport, hover-to-preview (silent, 4 timeline slices),
and full local-first source URLs.

Every uploader flow MUST use `src/components/media/VideoThumbnailPicker.tsx`
to either (a) auto-extract 6 candidate scene frames, or (b) accept a custom
upload. Selected thumbnail is stored via local-first storage and used as
`poster` on the viewer + as the social preview image.

Hover preview rules:
- Always muted, plays through 4 evenly-spaced timeline slices.
- Disabled for shorts (they already auto-play in viewport).
- Stops + rewinds on mouse-leave when not actively playing.
