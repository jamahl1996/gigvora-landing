import { createFileRoute } from '@tanstack/react-router';
import PrivacyPage from '@/pages/PrivacyPage';

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy — Gigvora' },
      { name: 'description', content: 'How Gigvora collects, uses, and protects your data.' },
      { property: 'og:title', content: 'Privacy Policy — Gigvora' },
      { property: 'og:description', content: 'Read the Gigvora privacy policy.' },
    ],
  }),
  component: () => <PrivacyPage />,
});