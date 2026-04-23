import { createFileRoute } from '@tanstack/react-router';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

export const Route = createFileRoute('/auth/reset-password')({
  head: () => ({ meta: [
    { title: 'Reset Password — Gigvora' },
    { name: 'description', content: 'Set a new password for your Gigvora account.' },
  ]}),
  component: () => <ResetPasswordPage />,
});