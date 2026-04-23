import { createFileRoute } from '@tanstack/react-router';
import EscrowLedgerPage from '@/pages/finance/EscrowLedgerPage';
export const Route = createFileRoute('/finance/escrow')({
  head: () => ({ meta: [{ title: 'Escrow Ledger — Finance' }, { name: 'description', content: 'Escrow holds and release ledger.' }]}),
  component: () => <EscrowLedgerPage />,
});
