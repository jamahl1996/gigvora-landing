import { createFileRoute } from '@tanstack/react-router';
import JobCreatePage from '@/pages/jobs/JobCreatePage';
export const Route = createFileRoute('/jobs/create')({
  head: () => ({ meta: [{ title: 'Post a Job — Gigvora' }, { name: 'description', content: 'Publish a job in 10 enterprise-grade steps with AI-assisted authoring.' }]}),
  component: () => <JobCreatePage />,
});
