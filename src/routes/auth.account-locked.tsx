import { createFileRoute } from '@tanstack/react-router';
import AccountLockedPage from '@/pages/auth/AccountLockedPage';

export const Route = createFileRoute('/auth/account-locked')({
  head: () => ({ meta: [
    { title: 'Account Locked — Gigvora' },
    { name: 'description', content: 'Your Gigvora account is temporarily locked.' },
  ]}),
  component: () => <AccountLockedPage />,
});