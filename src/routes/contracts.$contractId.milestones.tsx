import { createFileRoute } from '@tanstack/react-router';
import MilestonesPage from '@/pages/contracts/MilestonesPage';
export const Route = createFileRoute('/contracts/$contractId/milestones')({
  head: () => ({ meta: [{ title: 'Milestones — Contract' }, { name: 'description', content: 'Contract milestones overview.' }]}),
  component: () => <MilestonesPage />,
});
