import { createFileRoute } from '@tanstack/react-router';
import SettingsPage from '@/pages/settings/SettingsPage';
export const Route = createFileRoute('/settings')({
  head: () => ({ meta: [{ title: 'Settings — Gigvora' }, { name: 'description', content: 'Account, profile, and preferences.' }]}),
  component: () => <SettingsPage />,
});
