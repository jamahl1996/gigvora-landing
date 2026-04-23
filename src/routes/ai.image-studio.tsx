import { createFileRoute } from '@tanstack/react-router';
import AIImageStudioPage from '@/pages/ai/AIImageStudioPage';
export const Route = createFileRoute('/ai/image-studio')({
  head: () => ({ meta: [{ title: 'AI Image Studio — Gigvora' }, { name: 'description', content: 'Generate, edit, and iterate on images with multi-model AI.' }]}),
  component: () => <AIImageStudioPage />,
});
