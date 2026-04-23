import { createFileRoute } from '@tanstack/react-router';
import GigAnalyticsPage from '@/pages/gigs/GigAnalyticsPage';
export const Route = createFileRoute('/gigs/analytics')({
  head: () => ({ meta: [{ title: 'Gig Analytics — Gigvora' }, { name: 'description', content: 'Conversion, traffic, and revenue analytics for your gigs.' }]}),
  component: () => <GigAnalyticsPage />,
});
