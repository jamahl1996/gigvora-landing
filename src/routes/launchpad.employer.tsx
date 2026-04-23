import { createFileRoute } from '@tanstack/react-router';
import EmployerPartnerPage from '@/pages/launchpad/EmployerPartnerPage';
export const Route = createFileRoute('/launchpad/employer')({
  head: () => ({ meta: [{ title: 'Employer Partner — Launchpad' }, { name: 'description', content: 'Become an employer partner.' }]}),
  component: () => <EmployerPartnerPage />,
});
