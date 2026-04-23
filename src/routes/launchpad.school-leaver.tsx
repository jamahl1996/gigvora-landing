import { createFileRoute } from '@tanstack/react-router';
import SchoolLeaverPage from '@/pages/launchpad/SchoolLeaverPage';
export const Route = createFileRoute('/launchpad/school-leaver')({
  head: () => ({ meta: [{ title: 'School Leaver — Launchpad' }, { name: 'description', content: 'Pathways for school leavers.' }]}),
  component: () => <SchoolLeaverPage />,
});
