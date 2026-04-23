import { createFileRoute } from '@tanstack/react-router';
import VideoStudioPage from '@/pages/media/VideoStudioPage';
export const Route = createFileRoute('/media/videos/studio')({
  head: () => ({ meta: [{ title: 'Video Studio — Gigvora' }, { name: 'description', content: 'Edit, schedule, and analyze your videos.' }]}),
  component: () => <VideoStudioPage />,
});
