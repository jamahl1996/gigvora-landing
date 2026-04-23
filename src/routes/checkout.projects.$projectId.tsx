import { createFileRoute } from '@tanstack/react-router';
import ProjectFundingPage from '@/pages/checkout/ProjectFundingPage';
export const Route = createFileRoute('/checkout/projects/$projectId')({
  head: () => ({ meta: [{ title: 'Funding — Project' }, { name: 'description', content: 'Fund a project escrow.' }]}),
  component: () => <ProjectFundingPage />,
});
