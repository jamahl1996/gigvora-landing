import { createFileRoute } from '@tanstack/react-router';
import PaymentsEscrowPolicyPage from '@/pages/legal/PaymentsEscrowPolicyPage';

export const Route = createFileRoute('/legal/payments-escrow')({
  head: () => ({ meta: [
    { title: 'Payments & Escrow Policy — Gigvora' },
    { name: 'description', content: 'How Gigvora handles payments, escrow, refunds, and chargebacks.' },
  ]}),
  component: () => <PaymentsEscrowPolicyPage />,
});