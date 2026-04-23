import { createFileRoute } from '@tanstack/react-router';
import BadgesVerificationPage from '@/pages/launchpad/BadgesVerificationPage';
export const Route = createFileRoute('/launchpad/badges')({
  head: () => ({ meta: [{ title: 'Badges — Launchpad' }, { name: 'description', content: 'Verifiable skill badges.' }]}),
  component: () => <BadgesVerificationPage />,
});
