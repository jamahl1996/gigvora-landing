import { createFileRoute } from '@tanstack/react-router';
import ShowcaseGigsPage from '@/pages/showcase/ShowcaseGigsPage';

export const Route = createFileRoute('/showcase/gigs')({
  head: () => ({ meta: [
    { title: 'Gigs Marketplace — Gigvora' },
    { name: 'description', content: 'Explore productized gigs from top creators and freelancers on Gigvora.' },
    { property: 'og:title', content: 'Gigs Marketplace — Gigvora' },
    { property: 'og:description', content: 'Tiered packages from verified Gigvora sellers.' },
  ]}),
  component: () => <ShowcaseGigsPage />,
});