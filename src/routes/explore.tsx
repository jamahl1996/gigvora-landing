import { createFileRoute } from '@tanstack/react-router';
import ExplorerPage from '@/pages/explore/ExplorerPage';
export const Route = createFileRoute('/explore')({
  head: () => ({ meta: [{ title: 'Explore — Gigvora' }, { name: 'description', content: 'Discover people, jobs, projects, gigs, and more across Gigvora.' }]}),
  component: () => <ExplorerPage />,
});
