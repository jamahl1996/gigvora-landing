import { createFileRoute } from '@tanstack/react-router';
import ProjectDashboardPage from '@/pages/projects/ProjectDashboardPage';
export const Route = createFileRoute('/projects/dashboard')({
  head: () => ({ meta: [{ title: 'Project Dashboard — Gigvora' }, { name: 'description', content: 'Cross-project KPIs, blockers, and delivery health at a glance.' }]}),
  component: () => <ProjectDashboardPage />,
});
