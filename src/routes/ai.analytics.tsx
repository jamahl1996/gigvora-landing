import { createFileRoute } from '@tanstack/react-router';
import AIAnalyticsAssistantPage from '@/pages/ai/AIAnalyticsAssistantPage';
export const Route = createFileRoute('/ai/analytics')({
  head: () => ({ meta: [{ title: 'Analytics Assistant — Gigvora AI' }, { name: 'description', content: 'Ask natural-language questions across your Gigvora analytics.' }]}),
  component: () => <AIAnalyticsAssistantPage />,
});
