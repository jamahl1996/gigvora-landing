import { createFileRoute } from '@tanstack/react-router';
import StartupShowcasePage from '@/pages/enterprise/StartupShowcasePage';
export const Route = createFileRoute('/enterprise/startups')({
  head: () => ({ meta: [{ title: 'Startup Showcase — Enterprise — Gigvora' }, { name: 'description', content: 'Discover high-growth startups for partnerships and investment.' }]}),
  component: () => <StartupShowcasePage />,
});
