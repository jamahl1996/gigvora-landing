import { createFileRoute } from '@tanstack/react-router';
import ShowcaseCreatorPage from '@/pages/showcase/ShowcaseCreatorPage';

export const Route = createFileRoute('/showcase/creator')({
  head: () => ({ meta: [
    { title: 'Creator Studio — Gigvora' },
    { name: 'description', content: 'Publish, monetize, and grow your audience with Gigvora Creator Studio.' },
    { property: 'og:title', content: 'Creator Studio — Gigvora' },
    { property: 'og:description', content: 'Build a creator business on Gigvora.' },
  ]}),
  component: () => <ShowcaseCreatorPage />,
});