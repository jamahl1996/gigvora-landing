import { createFileRoute } from '@tanstack/react-router';
import LaunchpadPathwaysPage from '@/pages/launchpad/LaunchpadPathwaysPage';
export const Route = createFileRoute('/launchpad/pathways')({
  head: () => ({ meta: [{ title: 'Pathways — Launchpad' }, { name: 'description', content: 'Structured career pathways for new entrants.' }]}),
  component: () => <LaunchpadPathwaysPage />,
});
