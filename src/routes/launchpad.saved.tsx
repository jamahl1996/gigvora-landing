import { createFileRoute } from '@tanstack/react-router';
import LaunchpadSavedPage from '@/pages/launchpad/LaunchpadSavedPage';
export const Route = createFileRoute('/launchpad/saved')({
  head: () => ({ meta: [{ title: 'Saved — Launchpad' }, { name: 'description', content: 'Your saved launchpad opportunities.' }]}),
  component: () => <LaunchpadSavedPage />,
});
