import { createFileRoute } from '@tanstack/react-router';
import GigArchivePage from '@/pages/gigs/GigArchivePage';
export const Route = createFileRoute('/gigs/archive')({
  head: () => ({ meta: [{ title: 'Gig Archive — Gigvora' }, { name: 'description', content: 'Archived and paused gigs across your seller workspace.' }]}),
  component: () => <GigArchivePage />,
});
