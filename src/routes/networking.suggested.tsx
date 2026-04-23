import { createFileRoute } from '@tanstack/react-router';
import SuggestedConnectionsPage from '@/pages/networking/SuggestedConnectionsPage';
export const Route = createFileRoute('/networking/suggested')({
  head: () => ({ meta: [{ title: 'Suggested Connections — Gigvora' }, { name: 'description', content: 'AI-suggested high-fit connections across the Gigvora network.' }]}),
  component: () => <SuggestedConnectionsPage />,
});
