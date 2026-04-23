import { createFileRoute } from '@tanstack/react-router';
import ProjectsBrowsePage from '@/pages/projects/ProjectsBrowsePage';
export const Route = createFileRoute('/projects')({
  head: () => ({ meta: [{ title: 'Projects — Gigvora' }, { name: 'description', content: 'Browse open client projects across every category.' }]}),
  component: () => <ProjectsBrowsePage />,
});
