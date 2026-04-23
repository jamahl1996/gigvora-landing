import { createFileRoute } from '@tanstack/react-router';
import ExperienceProjectsPage from '@/pages/launchpad/ExperienceProjectsPage';
export const Route = createFileRoute('/launchpad/projects')({
  head: () => ({ meta: [{ title: 'Projects — Launchpad' }, { name: 'description', content: 'Hands-on experience projects.' }]}),
  component: () => <ExperienceProjectsPage />,
});
