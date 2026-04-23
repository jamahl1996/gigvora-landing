import { createFileRoute } from '@tanstack/react-router';
import AdvertisingPolicyPage from '@/pages/legal/AdvertisingPolicyPage';

export const Route = createFileRoute('/legal/advertising-policy')({
  head: () => ({ meta: [
    { title: 'Advertising Policy — Gigvora' },
    { name: 'description', content: 'Rules and standards for advertising on Gigvora.' },
    { property: 'og:title', content: 'Advertising Policy — Gigvora' },
    { property: 'og:description', content: 'Standards governing ads on Gigvora.' },
  ]}),
  component: () => <AdvertisingPolicyPage />,
});