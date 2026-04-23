import { createFileRoute } from '@tanstack/react-router';
import CareerChangerPage from '@/pages/launchpad/CareerChangerPage';
export const Route = createFileRoute('/launchpad/career-changer')({
  head: () => ({ meta: [{ title: 'Career Changer — Launchpad' }, { name: 'description', content: 'Programs for career changers.' }]}),
  component: () => <CareerChangerPage />,
});
