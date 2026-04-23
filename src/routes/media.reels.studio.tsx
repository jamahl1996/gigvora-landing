import { createFileRoute } from '@tanstack/react-router';
import ReelsEditingStudioPage from '@/pages/media/ReelsEditingStudioPage';
export const Route = createFileRoute('/media/reels/studio')({
  head: () => ({ meta: [{ title: 'Reels Studio — Gigvora' }, { name: 'description', content: 'Edit and publish vertical reels.' }]}),
  component: () => <ReelsEditingStudioPage />,
});
