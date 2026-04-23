import { createFileRoute } from '@tanstack/react-router';
import GigsDiscoveryPage from '@/pages/gigs/GigsDiscoveryPage';
export const Route = createFileRoute('/gigs')({
  head: () => ({ meta: [{ title: 'Gigs Marketplace — Gigvora' }, { name: 'description', content: 'Discover productized gigs with tiered pricing across every category.' }]}),
  component: () => <GigsDiscoveryPage />,
});
