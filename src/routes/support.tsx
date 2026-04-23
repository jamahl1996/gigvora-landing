import { createFileRoute } from '@tanstack/react-router';
import SupportPage from '@/pages/SupportPage';

export const Route = createFileRoute('/support')({
  head: () => ({
    meta: [
      { title: 'Support Center — Gigvora' },
      { name: 'description', content: 'Get help with your Gigvora account — guides, FAQs, and direct contact options.' },
      { property: 'og:title', content: 'Support — Gigvora' },
      { property: 'og:description', content: 'Get help with your Gigvora account.' },
    ],
  }),
  component: () => <SupportPage />,
});