import { createFileRoute } from '@tanstack/react-router';
import ApplicationTrackerPage from '@/pages/jobs/ApplicationTrackerPage';
export const Route = createFileRoute('/jobs/applications')({
  head: () => ({ meta: [{ title: 'My Applications — Jobs — Gigvora' }, { name: 'description', content: 'Track every job application you have submitted.' }]}),
  component: () => <ApplicationTrackerPage />,
});
