---
name: WebSockets Everywhere
description: Socket.IO (NotificationsGateway + src/lib/realtime/socket.ts) is mandatory for every realtime surface with auto-reconnect.
type: feature
---

Every domain that benefits from realtime (calls, podcasts, webinars, inbox,
notifications, presence, feed counters, queue updates, recording status,
purchases, voice-note delivery) MUST publish events through
`apps/api-nest/src/modules/notifications/notifications.gateway.ts` and
consume them on the client via `src/lib/realtime/socket.ts` (singleton
client w/ exponential backoff, infinite reconnection attempts, room
helpers `joinTopic` / `joinEntity`, hook `useRealtimeEvent`).

Channels follow the pattern:
- `user:{identityId}` — personal events
- `topic:{topic}`     — global broadcast
- `entity:{type}:{id}` — granular co-edit / co-view

When adding a new domain, wire emission for every state transition AND
ensure the client subscribes via `useRealtimeEvent` with optimistic UI.
