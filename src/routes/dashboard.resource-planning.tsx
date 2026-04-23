import { createFileRoute } from '@tanstack/react-router';
import ResourcePlanningPage from '@/pages/dashboard/ResourcePlanningPage';

export const Route = createFileRoute('/dashboard/resource-planning')({
  head: () => ({ meta: [
    { title: 'Resource Planning — Dashboard — Gigvora' },
    { name: 'description', content: 'Capacity, allocation, and forecast across your team.' },
  ]}),
  component: () => <ResourcePlanningPage />,
});
