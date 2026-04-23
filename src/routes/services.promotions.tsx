import { createFileRoute } from '@tanstack/react-router';
import ServicePromotionsPage from '@/pages/services/ServicePromotionsPage';
export const Route = createFileRoute('/services/promotions')({
  head: () => ({ meta: [{ title: 'Service Promotions — Gigvora' }, { name: 'description', content: 'Discounts and featured placement for your services.' }]}),
  component: () => <ServicePromotionsPage />,
});
