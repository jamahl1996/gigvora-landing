import { createFileRoute } from '@tanstack/react-router';
import GigMediaManagerPage from '@/pages/gigs/GigMediaManagerPage';
export const Route = createFileRoute('/gigs/media')({
  head: () => ({ meta: [{ title: 'Gig Media Manager — Gigvora' }, { name: 'description', content: 'Manage cover art, gallery, and rich media for every gig.' }]}),
  component: () => <GigMediaManagerPage />,
});
