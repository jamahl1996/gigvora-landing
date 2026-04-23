import { createFileRoute } from '@tanstack/react-router';
import ShowcaseNetworkingPage from '@/pages/showcase/ShowcaseNetworkingPage';

export const Route = createFileRoute('/showcase/networking')({
  head: () => ({ meta: [
    { title: 'Networking — Gigvora' },
    { name: 'description', content: 'Digital business cards, follow-ups, and relationship management on Gigvora.' },
    { property: 'og:title', content: 'Networking — Gigvora' },
    { property: 'og:description', content: 'A modern professional network built for follow-through.' },
  ]}),
  component: () => <ShowcaseNetworkingPage />,
});