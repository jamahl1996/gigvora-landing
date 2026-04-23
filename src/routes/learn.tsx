import { createFileRoute } from '@tanstack/react-router';
import LearnPage from '@/pages/learn/LearnPage';
export const Route = createFileRoute('/learn')({
  head: () => ({ meta: [{ title: 'Learn — Gigvora' }, { name: 'description', content: 'Curated learning paths and courses for professionals.' }]}),
  component: () => <LearnPage />,
});
