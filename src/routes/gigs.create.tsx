import { createFileRoute } from '@tanstack/react-router';
import GigCreatePage from '@/pages/gigs/GigCreatePage';
export const Route = createFileRoute('/gigs/create')({
  head: () => ({ meta: [{ title: 'Create a Gig — Gigvora' }, { name: 'description', content: 'Publish a new productized gig in 10 enterprise-grade steps.' }]}),
  component: () => <GigCreatePage />,
});
