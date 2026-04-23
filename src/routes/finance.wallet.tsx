import { createFileRoute } from '@tanstack/react-router';
import WalletPage from '@/pages/finance/WalletPage';
export const Route = createFileRoute('/finance/wallet')({
  head: () => ({ meta: [{ title: 'Wallet — Finance' }, { name: 'description', content: 'On-platform wallet and balance.' }]}),
  component: () => <WalletPage />,
});
