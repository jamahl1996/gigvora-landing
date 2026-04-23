import { createFileRoute } from '@tanstack/react-router';
import PayoutsPage from '@/pages/finance/PayoutsPage';
export const Route = createFileRoute('/finance/payouts')({
  head: () => ({ meta: [{ title: 'Payouts — Finance' }, { name: 'description', content: 'Track payouts to your bank.' }]}),
  component: () => <PayoutsPage />,
});
