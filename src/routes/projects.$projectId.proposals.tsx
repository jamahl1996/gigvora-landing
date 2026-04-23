import { createFileRoute } from '@tanstack/react-router';
import ProposalReviewAwardPage from '@/pages/projects/ProposalReviewAwardPage';
export const Route = createFileRoute('/projects/$projectId/proposals')({
  head: () => ({ meta: [{ title: 'Proposals — Project' }, { name: 'description', content: 'Review and award proposals.' }]}),
  component: () => <ProposalReviewAwardPage />,
});
