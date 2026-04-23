import { createFileRoute } from '@tanstack/react-router';
import VerifyPage from '@/pages/auth/VerifyPage';

export const Route = createFileRoute('/auth/verify')({
  head: () => ({ meta: [
    { title: 'Verify Your Email — Gigvora' },
    { name: 'description', content: 'Verify your email address to activate your Gigvora account.' },
  ]}),
  component: () => <VerifyPage />,
});