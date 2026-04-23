import { createFileRoute } from '@tanstack/react-router';
import AIBYOKPage from '@/pages/ai/AIBYOKPage';
export const Route = createFileRoute('/ai/byok')({
  head: () => ({ meta: [{ title: 'Bring Your Own Key — Gigvora AI' }, { name: 'description', content: 'Connect your own AI provider keys for OpenAI, Anthropic, Gemini, and 100+ more.' }]}),
  component: () => <AIBYOKPage />,
});
