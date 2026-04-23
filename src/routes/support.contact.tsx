import { createFileRoute } from '@tanstack/react-router';
import ContactPage from '@/pages/ContactPage';

export const Route = createFileRoute('/support/contact')({
  head: () => ({
    meta: [
      { title: 'Contact Support — Gigvora' },
      { name: 'description', content: 'Reach the Gigvora support team for billing, account, or platform questions.' },
      { property: 'og:title', content: 'Contact Support — Gigvora' },
      { property: 'og:description', content: 'Get in touch with the Gigvora team.' },
    ],
  }),
  component: () => <ContactPage />,
});