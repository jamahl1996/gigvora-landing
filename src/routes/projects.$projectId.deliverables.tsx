import { createFileRoute } from '@tanstack/react-router';
import ProjectDeliverablesPage from '@/pages/projects/ProjectDeliverablesPage';
export const Route = createFileRoute('/projects/$projectId/deliverables')({
  head: () => ({ meta: [{ title: 'Deliverables — Project' }, { name: 'description', content: 'Project deliverables and reviews.' }]}),
  component: () => <ProjectDeliverablesPage />,
});
