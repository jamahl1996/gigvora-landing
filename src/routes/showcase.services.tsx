import { createFileRoute } from '@tanstack/react-router';
import ShowcaseServicesPage from '@/pages/showcase/ShowcaseServicesPage';

export const Route = createFileRoute('/showcase/services')({
  head: () => ({ meta: [
    { title: 'Services — Gigvora' },
    { name: 'description', content: 'Hire vetted professionals offering retainers and ongoing services.' },
    { property: 'og:title', content: 'Services — Gigvora' },
    { property: 'og:description', content: 'Retainer-based services from Gigvora professionals.' },
  ]}),
  component: () => <ShowcaseServicesPage />,
});