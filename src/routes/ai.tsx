import { createFileRoute } from '@tanstack/react-router';
import AIToolsHubPage from '@/pages/ai/AIToolsHubPage';
export const Route = createFileRoute('/ai')({
  head: () => ({ meta: [{ title: 'Gigvora AI — Tools Hub' }, { name: 'description', content: 'All AI tools, copilots, and studios in one hub.' }]}),
  component: () => <AIToolsHubPage />,
});
