import { createFileRoute } from '@tanstack/react-router';
import ShowcaseJobsPage from '@/pages/showcase/ShowcaseJobsPage';

export const Route = createFileRoute('/showcase/jobs')({
  head: () => ({ meta: [
    { title: 'Jobs — Gigvora' },
    { name: 'description', content: 'Discover full-time, contract, and remote roles from companies hiring on Gigvora.' },
    { property: 'og:title', content: 'Jobs — Gigvora' },
    { property: 'og:description', content: 'Find your next role on Gigvora.' },
  ]}),
  component: () => <ShowcaseJobsPage />,
});