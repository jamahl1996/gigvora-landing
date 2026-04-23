import { createFileRoute } from '@tanstack/react-router';
import MentorMatchingPage from '@/pages/launchpad/MentorMatchingPage';
export const Route = createFileRoute('/launchpad/mentors')({
  head: () => ({ meta: [{ title: 'Mentors — Launchpad' }, { name: 'description', content: 'Match with mentors for career guidance.' }]}),
  component: () => <MentorMatchingPage />,
});
