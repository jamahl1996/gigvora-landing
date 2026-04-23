import { createFileRoute } from '@tanstack/react-router';
import MediaAnalyticsPage from '@/pages/media/MediaAnalyticsPage';
export const Route = createFileRoute('/media/analytics')({
  head: () => ({ meta: [{ title: 'Media Analytics — Gigvora' }, { name: 'description', content: 'Analyze performance across your media catalog.' }]}),
  component: () => <MediaAnalyticsPage />,
});
