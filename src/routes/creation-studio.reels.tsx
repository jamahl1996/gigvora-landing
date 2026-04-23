import { createFileRoute } from '@tanstack/react-router';
import ReelBuilderPage from '@/pages/creation-studio/ReelBuilderPage';
export const Route = createFileRoute('/creation-studio/reels')({
  head: () => ({ meta: [{ title: 'Reel Builder — Creation Studio' }, { name: 'description', content: 'Build vertical reels with AI-assisted editing.' }]}),
  component: () => <ReelBuilderPage />,
});
