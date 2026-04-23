import { createFileRoute } from '@tanstack/react-router';
import ProjectArchivePage from '@/pages/projects/ProjectArchivePage';
export const Route = createFileRoute('/projects/archive')({
  head: () => ({ meta: [{ title: 'Project Archive — Gigvora' }, { name: 'description', content: 'Archived and completed projects across your workspace.' }]}),
  component: () => <ProjectArchivePage />,
});
