import { createFileRoute } from '@tanstack/react-router';
import JobWorkspacePage from '@/pages/jobs/JobWorkspacePage';
export const Route = createFileRoute('/jobs/workspace')({
  head: () => ({ meta: [{ title: 'Job Workspace — Gigvora' }, { name: 'description', content: 'Manage every open job, applicant pipeline, and hiring stage.' }]}),
  component: () => <JobWorkspacePage />,
});
