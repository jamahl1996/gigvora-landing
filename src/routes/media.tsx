import { createFileRoute } from '@tanstack/react-router';
import MediaHomePage from '@/pages/media/MediaHomePage';
export const Route = createFileRoute('/media')({
  head: () => ({ meta: [{ title: 'Media — Gigvora' }, { name: 'description', content: 'The unified media hub for reels, videos, and creators.' }]}),
  component: () => <MediaHomePage />,
});
