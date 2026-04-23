import { createFileRoute } from '@tanstack/react-router';
import MentorFeedbackPage from '@/pages/mentorship/MentorFeedbackPage';
export const Route = createFileRoute('/mentorship/feedback')({
  head: () => ({ meta: [{ title: 'Mentor Feedback — Gigvora' }, { name: 'description', content: 'Review and provide feedback for mentor sessions.' }]}),
  component: () => <MentorFeedbackPage />,
});
