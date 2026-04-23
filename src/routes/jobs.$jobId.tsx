import { createFileRoute } from '@tanstack/react-router';
import JobDetailPage from '@/pages/jobs/JobDetailPage';
export const Route = createFileRoute('/jobs/$jobId')({
  head: () => ({ meta: [{ title: 'Job Details — Gigvora' }, { name: 'description', content: 'View job description and apply.' }]}),
  component: () => <JobDetailPage />,
});
