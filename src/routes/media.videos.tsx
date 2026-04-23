import { createFileRoute } from '@tanstack/react-router';
import VideoDiscoveryPage from '@/pages/media/VideoDiscoveryPage';
export const Route = createFileRoute('/media/videos')({
  head: () => ({ meta: [{ title: 'Videos — Gigvora' }, { name: 'description', content: 'Discover long-form videos from creators.' }]}),
  component: () => <VideoDiscoveryPage />,
});
