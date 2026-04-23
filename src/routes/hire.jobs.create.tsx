import { createFileRoute } from '@tanstack/react-router';
import HireJobCreatePage from '@/pages/hire/HireJobCreatePage';

export const Route = createFileRoute('/hire/jobs/create')({
  head: () => ({ meta: [
    { title: 'Create Job — Hire — Gigvora' },
    { name: 'description', content: 'Post a job in 10 enterprise-grade steps on Gigvora.' },
  ]}),
  component: () => <HireJobCreatePage />,
});
