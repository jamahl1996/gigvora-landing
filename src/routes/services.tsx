import { createFileRoute } from '@tanstack/react-router';
import ServicesMarketplacePage from '@/pages/services/ServicesMarketplacePage';
export const Route = createFileRoute('/services')({
  head: () => ({ meta: [{ title: 'Services Marketplace — Gigvora' }, { name: 'description', content: 'Discover bespoke professional services across every category.' }]}),
  component: () => <ServicesMarketplacePage />,
});
