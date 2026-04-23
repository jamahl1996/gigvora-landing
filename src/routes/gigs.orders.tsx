import { createFileRoute } from '@tanstack/react-router';
import GigOrdersCenterPage from '@/pages/gigs/GigOrdersCenterPage';
export const Route = createFileRoute('/gigs/orders')({
  head: () => ({ meta: [{ title: 'Gig Orders — Gigvora' }, { name: 'description', content: 'All incoming and outgoing gig orders in one center.' }]}),
  component: () => <GigOrdersCenterPage />,
});
