import { createFileRoute } from '@tanstack/react-router';
import AIRecruiterAssistantPage from '@/pages/ai/AIRecruiterAssistantPage';
export const Route = createFileRoute('/ai/recruiter')({
  head: () => ({ meta: [{ title: 'Recruiter Assistant — Gigvora AI' }, { name: 'description', content: 'AI copilot for sourcing, screening, and shortlisting candidates.' }]}),
  component: () => <AIRecruiterAssistantPage />,
});
