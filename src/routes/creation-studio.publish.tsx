import { createFileRoute } from '@tanstack/react-router';
import PublishReviewPage from '@/pages/creation-studio/PublishReviewPage';
export const Route = createFileRoute('/creation-studio/publish')({
  head: () => ({ meta: [{ title: 'Publish & Review — Creation Studio' }, { name: 'description', content: 'Final review and approvals before publishing content.' }]}),
  component: () => <PublishReviewPage />,
});
