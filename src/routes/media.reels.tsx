import { createFileRoute } from '@tanstack/react-router';
import ReelsDiscoveryPage from '@/pages/media/ReelsDiscoveryPage';
export const Route = createFileRoute('/media/reels')({
  head: () => ({ meta: [{ title: 'Reels — Gigvora' }, { name: 'description', content: 'Discover short-form vertical reels from creators.' }]}),
  component: () => <ReelsDiscoveryPage />,
});
