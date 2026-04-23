import { createFileRoute } from '@tanstack/react-router';
import LaunchpadChallengesPage from '@/pages/launchpad/LaunchpadChallengesPage';
export const Route = createFileRoute('/launchpad/challenges')({
  head: () => ({ meta: [{ title: 'Challenges — Launchpad' }, { name: 'description', content: 'Skill-building challenges to prove your craft.' }]}),
  component: () => <LaunchpadChallengesPage />,
});
