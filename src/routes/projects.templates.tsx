import { createFileRoute } from '@tanstack/react-router';
import ProjectTemplatesPage from '@/pages/projects/ProjectTemplatesPage';
export const Route = createFileRoute('/projects/templates')({
  head: () => ({ meta: [{ title: 'Project Templates — Gigvora' }, { name: 'description', content: 'Reusable project templates to accelerate kickoff.' }]}),
  component: () => <ProjectTemplatesPage />,
});
