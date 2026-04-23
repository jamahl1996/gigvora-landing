import { createFileRoute } from '@tanstack/react-router';
import AgencyPage from '@/pages/agency/AgencyPage';
export const Route = createFileRoute('/agency/$agencyId')({
  head: () => ({ meta: [{ title: 'Agency — Gigvora' }, { name: 'description', content: 'Agency profile and services.' }]}),
  component: () => <AgencyPage />,
});
