import { createFileRoute } from '@tanstack/react-router';
import AIOutreachAssistantPage from '@/pages/ai/AIOutreachAssistantPage';
export const Route = createFileRoute('/ai/outreach')({
  head: () => ({ meta: [{ title: 'Outreach Assistant — Gigvora AI' }, { name: 'description', content: 'Personalized recruiter and sales outreach drafts powered by AI.' }]}),
  component: () => <AIOutreachAssistantPage />,
});
