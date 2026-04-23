import { createFileRoute } from '@tanstack/react-router';
import ProjectsSearchPage from '@/pages/explore/ProjectsSearchPage';
export const Route = createFileRoute('/explore/projects')({
  head: () => ({ meta: [{ title: 'Project Search — Gigvora' }, { name: 'description', content: 'Find client projects matching your skills.' }]}),
  component: () => <ProjectsSearchPage />,
});
