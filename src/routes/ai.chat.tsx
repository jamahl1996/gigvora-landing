import { createFileRoute } from '@tanstack/react-router';
import AIChatWorkspacePage from '@/pages/ai/AIChatWorkspacePage';
export const Route = createFileRoute('/ai/chat')({
  head: () => ({ meta: [{ title: 'AI Chat — Gigvora' }, { name: 'description', content: 'Conversational AI workspace with multi-model support.' }]}),
  component: () => <AIChatWorkspacePage />,
});
