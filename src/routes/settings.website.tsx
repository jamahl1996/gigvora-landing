import { createFileRoute } from '@tanstack/react-router';
import WebsiteSettingsPage from '@/pages/settings/WebsiteSettingsPage';
export const Route = createFileRoute('/settings/website')({
  head: () => ({ meta: [{ title: 'Website — Settings' }, { name: 'description', content: 'Public website and SEO settings.' }]}),
  component: () => <WebsiteSettingsPage />,
});
