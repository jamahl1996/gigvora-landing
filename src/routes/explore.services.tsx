import { createFileRoute } from '@tanstack/react-router';
import ServicesSearchPage from '@/pages/explore/ServicesSearchPage';
export const Route = createFileRoute('/explore/services')({
  head: () => ({ meta: [{ title: 'Services Search — Gigvora' }, { name: 'description', content: 'Search bespoke services across categories and price.' }]}),
  component: () => <ServicesSearchPage />,
});
