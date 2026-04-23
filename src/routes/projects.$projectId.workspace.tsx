import { createFileRoute } from '@tanstack/react-router';
import ProjectWorkspacePage from '@/pages/projects/ProjectWorkspacePage';
export const Route = createFileRoute('/projects/$projectId/workspace')({
  head: () => ({ meta: [{ title: 'Project Workspace — Gigvora' }, { name: 'description', content: 'Project workspace with tasks and files.' }]}),
  component: () => <ProjectWorkspacePage />,
});
