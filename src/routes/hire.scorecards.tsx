import { createFileRoute } from '@tanstack/react-router';
import HireScorecardsPage from '@/pages/hire/HireScorecardsPage';

export const Route = createFileRoute('/hire/scorecards')({
  head: () => ({ meta: [
    { title: 'Scorecards — Hire — Gigvora' },
    { name: 'description', content: 'Structured interview scorecards and panel feedback.' },
  ]}),
  component: () => <HireScorecardsPage />,
});
