import { createFileRoute } from '@tanstack/react-router';
import ServiceCheckoutPage from '@/pages/checkout/ServiceCheckoutPage';
export const Route = createFileRoute('/checkout/services/$serviceId')({
  head: () => ({ meta: [{ title: 'Checkout — Service' }, { name: 'description', content: 'Complete your service purchase.' }]}),
  component: () => <ServiceCheckoutPage />,
});
