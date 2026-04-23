import { createFileRoute } from '@tanstack/react-router';
import JobsSearchPage from '@/pages/explore/JobsSearchPage';
export const Route = createFileRoute('/explore/jobs')({
  head: () => ({ meta: [{ title: 'Job Search — Gigvora' }, { name: 'description', content: 'Search open roles across every category and location.' }]}),
  component: () => <JobsSearchPage />,
});
