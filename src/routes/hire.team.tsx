import { createFileRoute } from '@tanstack/react-router';
import HireTeamPage from '@/pages/hire/HireTeamPage';

export const Route = createFileRoute('/hire/team')({
  head: () => ({ meta: [
    { title: 'Hiring Team — Gigvora' },
    { name: 'description', content: 'Manage your hiring team, roles, and panelists on Gigvora.' },
  ]}),
  component: () => <HireTeamPage />,
});
