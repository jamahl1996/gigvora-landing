import { createFileRoute } from '@tanstack/react-router';
import MentorPaymentsPage from '@/pages/mentorship/MentorPaymentsPage';
export const Route = createFileRoute('/mentorship/payments')({
  head: () => ({ meta: [{ title: 'Mentor Payments — Gigvora' }, { name: 'description', content: 'Manage mentor session payments and payouts.' }]}),
  component: () => <MentorPaymentsPage />,
});
