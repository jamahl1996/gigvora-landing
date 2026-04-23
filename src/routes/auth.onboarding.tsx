import { createFileRoute } from '@tanstack/react-router';
import OnboardingPage from '@/pages/auth/OnboardingPage';

export const Route = createFileRoute('/auth/onboarding')({
  head: () => ({ meta: [
    { title: 'Welcome to Gigvora — Onboarding' },
    { name: 'description', content: 'Set up your Gigvora profile and pick your starter workspaces.' },
  ]}),
  component: () => <OnboardingPage />,
});