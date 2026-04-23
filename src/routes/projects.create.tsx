import { createFileRoute } from '@tanstack/react-router';
import ProjectCreatePage from '@/pages/projects/ProjectCreatePage';
export const Route = createFileRoute('/projects/create')({
  head: () => ({ meta: [{ title: 'New Project — Gigvora' }, { name: 'description', content: 'Post a new client project in 10 enterprise-grade steps.' }]}),
  component: () => <ProjectCreatePage />,
});
