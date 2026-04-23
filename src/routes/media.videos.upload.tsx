import { createFileRoute } from '@tanstack/react-router';
import VideoUploadStudioPage from '@/pages/media/VideoUploadStudioPage';
export const Route = createFileRoute('/media/videos/upload')({
  head: () => ({ meta: [{ title: 'Upload Video — Gigvora' }, { name: 'description', content: 'Upload and publish a new video.' }]}),
  component: () => <VideoUploadStudioPage />,
});
