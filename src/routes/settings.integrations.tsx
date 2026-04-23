import { createFileRoute } from '@tanstack/react-router';
import IntegrationsSettingsPage from '@/pages/settings/IntegrationsSettingsPage';
export const Route = createFileRoute('/settings/integrations')({
  head: () => ({ meta: [{ title: 'Integrations — Settings' }, { name: 'description', content: 'Connect third-party tools and apps.' }]}),
  component: () => <IntegrationsSettingsPage />,
});
