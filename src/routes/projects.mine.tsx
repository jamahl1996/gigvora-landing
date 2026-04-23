import { createFileRoute } from '@tanstack/react-router';
import MyProjectsPage from '@/pages/projects/MyProjectsPage';
export const Route = createFileRoute('/projects/mine')({
  head: () => ({ meta: [{ title: 'My Projects — Gigvora' }, { name: 'description', content: 'All projects you own, manage, or are working on.' }]}),
  component: () => <MyProjectsPage />,
});
