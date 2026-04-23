import { createFileRoute } from '@tanstack/react-router';
import EnterpriseMatchmakingPage from '@/pages/enterprise/EnterpriseMatchmakingPage';
export const Route = createFileRoute('/enterprise/matchmaking')({
  head: () => ({ meta: [{ title: 'Enterprise Matchmaking — Gigvora' }, { name: 'description', content: 'AI-powered matchmaking for enterprise buyers and partners.' }]}),
  component: () => <EnterpriseMatchmakingPage />,
});
