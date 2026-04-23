import { createFileRoute } from '@tanstack/react-router';
import WorkHubPage from '@/pages/work/WorkHubPage';

export const Route = createFileRoute('/work')({
  head: () => ({ meta: [
    { title: 'Work Hub — Gigvora' },
    { name: 'description', content: 'A unified hub for tasks, milestones, and approvals across every engagement.' },
  ]}),
  component: () => <WorkHubPage />,
});
