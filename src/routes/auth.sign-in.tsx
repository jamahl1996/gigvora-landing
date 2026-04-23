import { createFileRoute } from '@tanstack/react-router';
import SignInPage from '@/pages/auth/SignInPage';

export const Route = createFileRoute('/auth/sign-in')({
  head: () => ({ meta: [
    { title: 'Sign In — Gigvora' },
    { name: 'description', content: 'Sign in to your Gigvora account.' },
    { property: 'og:title', content: 'Sign In — Gigvora' },
    { property: 'og:description', content: 'Sign in to access your Gigvora workspace.' },
  ]}),
  component: () => <SignInPage />,
});