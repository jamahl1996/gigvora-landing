import { createFileRoute } from '@tanstack/react-router';
import VideoPlayerDetailPage from '@/pages/media/VideoPlayerDetailPage';
export const Route = createFileRoute('/media/videos/$videoId')({
  head: () => ({ meta: [{ title: 'Video — Gigvora' }, { name: 'description', content: 'Watch the video and engage with creators.' }]}),
  component: () => <VideoPlayerDetailPage />,
});
