import { createFileRoute } from '@tanstack/react-router';
import ContactPage from '@/pages/ContactPage';

export const Route = createFileRoute('/contact')({
  head: () => ({ meta: [
    { title: 'Contact — Gigvora' },
    { name: 'description', content: 'Get in touch with the Gigvora team.' },
  ]}),
  component: () => <ContactPage />,
});
