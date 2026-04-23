import { createFileRoute } from '@tanstack/react-router';
import RecruiterDashboardPage from '@/pages/dashboard/RecruiterDashboardPage';

export const Route = createFileRoute('/dashboard/recruiter')({
  head: () => ({ meta: [
    { title: 'Recruiter Dashboard — Gigvora' },
    { name: 'description', content: 'Pipeline, jobs, candidates, and interviews from one cockpit.' },
  ]}),
  component: () => <RecruiterDashboardPage />,
});
