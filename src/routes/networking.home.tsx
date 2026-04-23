import { createFileRoute } from '@tanstack/react-router';
import NetworkingHomePage from '@/pages/networking/NetworkingHomePage';
export const Route = createFileRoute('/networking/home')({
  head: () => ({ meta: [{ title: 'Networking Hub — Gigvora' }, { name: 'description', content: 'Live rooms, intros, follow-ups, and networking analytics.' }]}),
  component: () => <NetworkingHomePage />,
});
