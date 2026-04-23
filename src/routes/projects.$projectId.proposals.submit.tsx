import { createFileRoute } from '@tanstack/react-router';
import ProposalSubmissionPage from '@/pages/projects/ProposalSubmissionPage';
export const Route = createFileRoute('/projects/$projectId/proposals/submit')({
  head: () => ({ meta: [{ title: 'Submit Proposal — Project' }, { name: 'description', content: 'Submit a proposal for this project.' }]}),
  component: () => <ProposalSubmissionPage />,
});
