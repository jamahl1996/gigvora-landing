import { createFileRoute } from '@tanstack/react-router';
import StudioAnalyticsPage from '@/pages/creation-studio/StudioAnalyticsPage';
export const Route = createFileRoute('/creation-studio/analytics')({
  head: () => ({ meta: [{ title: 'Studio Analytics — Creation Studio' }, { name: 'description', content: 'Engagement, reach, and performance analytics across your content.' }]}),
  component: () => <StudioAnalyticsPage />,
});
