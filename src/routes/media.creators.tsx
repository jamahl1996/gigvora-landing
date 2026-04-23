import { createFileRoute } from '@tanstack/react-router';
import CreatorDiscoveryPage from '@/pages/media/CreatorDiscoveryPage';
export const Route = createFileRoute('/media/creators')({
  head: () => ({ meta: [{ title: 'Creators — Gigvora' }, { name: 'description', content: 'Discover top creators across the platform.' }]}),
  component: () => <CreatorDiscoveryPage />,
});
