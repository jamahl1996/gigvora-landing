import { createFileRoute } from '@tanstack/react-router';
import ProjectEscrowPage from '@/pages/projects/ProjectEscrowPage';
export const Route = createFileRoute('/projects/$projectId/escrow')({
  head: () => ({ meta: [{ title: 'Escrow — Project' }, { name: 'description', content: 'Project escrow funding and releases.' }]}),
  component: () => <ProjectEscrowPage />,
});
