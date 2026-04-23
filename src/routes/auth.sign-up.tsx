import { createFileRoute } from '@tanstack/react-router';
import SignUpPage from '@/pages/auth/SignUpPage';

export const Route = createFileRoute('/auth/sign-up')({
  head: () => ({ meta: [
    { title: 'Create your account — Gigvora' },
    { name: 'description', content: 'Join Gigvora — the enterprise platform for work, hire, network, and create.' },
    { property: 'og:title', content: 'Sign Up — Gigvora' },
    { property: 'og:description', content: 'Create a free Gigvora account in under a minute.' },
  ]}),
  component: () => <SignUpPage />,
});