import { createFileRoute } from '@tanstack/react-router';
import ShowcaseAdsPage from '@/pages/showcase/ShowcaseAdsPage';

export const Route = createFileRoute('/showcase/ads')({
  head: () => ({ meta: [
    { title: 'Advertising — Gigvora' },
    { name: 'description', content: 'Reach professional audiences with the Gigvora ads platform.' },
    { property: 'og:title', content: 'Gigvora Ads' },
    { property: 'og:description', content: 'Reach professional audiences on Gigvora.' },
  ]}),
  component: () => <ShowcaseAdsPage />,
});