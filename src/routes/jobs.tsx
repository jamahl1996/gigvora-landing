import { createFileRoute } from '@tanstack/react-router';
import JobsPages from '@/pages/jobs/JobsPages';
export const Route = createFileRoute('/jobs')({
  head: () => ({ meta: [{ title: 'Jobs — Gigvora' }, { name: 'description', content: 'Discover full-time, contract, and freelance roles across every industry.' }]}),
  component: () => <JobsPages />,
});
