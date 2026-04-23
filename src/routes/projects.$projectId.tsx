import { createFileRoute } from '@tanstack/react-router';
import ProjectDetailPage from '@/pages/projects/ProjectDetailPage';
export const Route = createFileRoute('/projects/$projectId')({
  head: () => ({ meta: [{ title: 'Project — Gigvora' }, { name: 'description', content: 'Project brief and proposals.' }]}),
  component: () => <ProjectDetailPage />,
});
