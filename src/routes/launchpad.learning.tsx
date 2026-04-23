import { createFileRoute } from '@tanstack/react-router';
import LearningPathsPage from '@/pages/launchpad/LearningPathsPage';
export const Route = createFileRoute('/launchpad/learning')({
  head: () => ({ meta: [{ title: 'Learning — Launchpad' }, { name: 'description', content: 'Curated learning paths.' }]}),
  component: () => <LearningPathsPage />,
});
