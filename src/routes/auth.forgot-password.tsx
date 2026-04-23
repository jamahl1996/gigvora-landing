import { createFileRoute } from '@tanstack/react-router';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

export const Route = createFileRoute('/auth/forgot-password')({
  head: () => ({ meta: [
    { title: 'Forgot Password — Gigvora' },
    { name: 'description', content: 'Reset your Gigvora account password.' },
  ]}),
  component: () => <ForgotPasswordPage />,
});