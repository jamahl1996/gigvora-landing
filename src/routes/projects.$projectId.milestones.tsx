import { createFileRoute } from '@tanstack/react-router';
import ProjectMilestonesPage from '@/pages/projects/ProjectMilestonesPage';
export const Route = createFileRoute('/projects/$projectId/milestones')({
  head: () => ({ meta: [{ title: 'Milestones — Project' }, { name: 'description', content: 'Project milestones and approvals.' }]}),
  component: () => <ProjectMilestonesPage />,
});
