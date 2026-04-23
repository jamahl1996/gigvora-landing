import { createFileRoute } from '@tanstack/react-router';
import TermsPage from '@/pages/TermsPage';

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms of Service — Gigvora' },
      { name: 'description', content: 'The terms governing your use of Gigvora.' },
      { property: 'og:title', content: 'Terms of Service — Gigvora' },
      { property: 'og:description', content: 'Read the Gigvora terms of service.' },
    ],
  }),
  component: () => <TermsPage />,
});