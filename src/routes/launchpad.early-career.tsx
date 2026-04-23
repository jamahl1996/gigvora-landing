import { createFileRoute } from '@tanstack/react-router';
import EarlyCareerPage from '@/pages/launchpad/EarlyCareerPage';
export const Route = createFileRoute('/launchpad/early-career')({
  head: () => ({ meta: [{ title: 'Early Career — Launchpad' }, { name: 'description', content: 'Programs for early-career professionals.' }]}),
  component: () => <EarlyCareerPage />,
});
