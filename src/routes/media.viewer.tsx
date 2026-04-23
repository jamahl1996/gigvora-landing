import { createFileRoute } from '@tanstack/react-router';
import MediaViewerPage from '@/pages/media/MediaViewerPage';
export const Route = createFileRoute('/media/viewer')({
  head: () => ({ meta: [{ title: 'Media Viewer — Gigvora' }, { name: 'description', content: 'Full-screen media viewer.' }]}),
  component: () => <MediaViewerPage />,
});
