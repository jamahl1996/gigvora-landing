import { createFileRoute } from '@tanstack/react-router';
import FAQPage from '@/pages/FAQPage';

export const Route = createFileRoute('/faq')({
  head: () => ({
    meta: [
      { title: 'FAQ — Gigvora' },
      { name: 'description', content: 'Answers to the most common questions about Gigvora — accounts, billing, hiring, and platform safety.' },
      { property: 'og:title', content: 'FAQ — Gigvora' },
      { property: 'og:description', content: 'Frequently asked questions about the Gigvora platform.' },
    ],
  }),
  component: () => <FAQPage />,
});