import { createFileRoute } from '@tanstack/react-router';
import AIProposalHelperPage from '@/pages/ai/AIProposalHelperPage';
export const Route = createFileRoute('/ai/proposal-helper')({
  head: () => ({ meta: [{ title: 'Proposal Helper — Gigvora AI' }, { name: 'description', content: 'Draft winning proposals tailored to each client brief.' }]}),
  component: () => <AIProposalHelperPage />,
});
