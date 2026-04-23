import { createFileRoute } from '@tanstack/react-router';
import FeedPage from '@/pages/FeedPage';

export const Route = createFileRoute('/feed')({
  head: () => ({ meta: [
    { title: 'Feed — Gigvora' },
    { name: 'description', content: 'Your professional feed: posts, opportunities, and updates from your network.' },
  ]}),
  component: () => <FeedPage />,
});