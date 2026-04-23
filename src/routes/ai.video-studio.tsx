import { createFileRoute } from '@tanstack/react-router';
import AIVideoStudioPage from '@/pages/ai/AIVideoStudioPage';
export const Route = createFileRoute('/ai/video-studio')({
  head: () => ({ meta: [{ title: 'AI Video Studio — Gigvora' }, { name: 'description', content: 'AI-powered video generation, editing, and reels.' }]}),
  component: () => <AIVideoStudioPage />,
});
