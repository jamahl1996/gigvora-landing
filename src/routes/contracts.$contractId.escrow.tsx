import { createFileRoute } from '@tanstack/react-router';
import EscrowPage from '@/pages/contracts/EscrowPage';
export const Route = createFileRoute('/contracts/$contractId/escrow')({
  head: () => ({ meta: [{ title: 'Escrow — Contract' }, { name: 'description', content: 'Contract escrow management.' }]}),
  component: () => <EscrowPage />,
});
