import { createFileRoute } from '@tanstack/react-router';
import LaunchpadSettingsPage from '@/pages/launchpad/LaunchpadSettingsPage';
export const Route = createFileRoute('/launchpad/settings')({
  head: () => ({ meta: [{ title: 'Settings — Launchpad' }, { name: 'description', content: 'Manage your launchpad preferences.' }]}),
  component: () => <LaunchpadSettingsPage />,
});
