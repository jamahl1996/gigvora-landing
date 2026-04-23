import { createFileRoute } from '@tanstack/react-router';
import MentorAnalyticsPage from '@/pages/mentorship/MentorAnalyticsPage';
export const Route = createFileRoute('/mentorship/analytics')({
  head: () => ({ meta: [{ title: 'Mentor Analytics — Gigvora' }, { name: 'description', content: 'Insights and metrics for mentor activity.' }]}),
  component: () => <MentorAnalyticsPage />,
});
