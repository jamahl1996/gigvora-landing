import { createFileRoute } from '@tanstack/react-router';
import PricingMonetizationPage from '@/pages/finance/PricingMonetizationPage';
export const Route = createFileRoute('/finance/pricing')({
  head: () => ({ meta: [{ title: 'Pricing — Finance' }, { name: 'description', content: 'Pricing and monetization controls.' }]}),
  component: () => <PricingMonetizationPage />,
});
