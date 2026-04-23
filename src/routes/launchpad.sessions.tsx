import { createFileRoute } from '@tanstack/react-router';
import MentorSessionsPage from '@/pages/launchpad/MentorSessionsPage';
export const Route = createFileRoute('/launchpad/sessions')({
  head: () => ({ meta: [{ title: 'Sessions — Launchpad' }, { name: 'description', content: 'Your mentor sessions.' }]}),
  component: () => <MentorSessionsPage />,
});
