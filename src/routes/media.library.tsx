import { createFileRoute } from '@tanstack/react-router';
import MediaLibraryPage from '@/pages/media/MediaLibraryPage';
export const Route = createFileRoute('/media/library')({
  head: () => ({ meta: [{ title: 'Media Library — Gigvora' }, { name: 'description', content: 'Your saved videos, reels, and media assets.' }]}),
  component: () => <MediaLibraryPage />,
});
