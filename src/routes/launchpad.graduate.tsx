import { createFileRoute } from '@tanstack/react-router';
import GraduateOpportunitiesPage from '@/pages/launchpad/GraduateOpportunitiesPage';
export const Route = createFileRoute('/launchpad/graduate')({
  head: () => ({ meta: [{ title: 'Graduate — Launchpad' }, { name: 'description', content: 'Graduate opportunities and schemes.' }]}),
  component: () => <GraduateOpportunitiesPage />,
});
