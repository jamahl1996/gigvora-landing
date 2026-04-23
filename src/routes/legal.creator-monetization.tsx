import { createFileRoute } from '@tanstack/react-router';
import CreatorMonetizationPolicyPage from '@/pages/legal/CreatorMonetizationPolicyPage';

export const Route = createFileRoute('/legal/creator-monetization')({
  head: () => ({ meta: [
    { title: 'Creator Monetization Policy — Gigvora' },
    { name: 'description', content: 'How creators earn, get paid, and maintain monetization status on Gigvora.' },
    { property: 'og:title', content: 'Creator Monetization — Gigvora' },
    { property: 'og:description', content: 'Earn and maintain monetization on Gigvora.' },
  ]}),
  component: () => <CreatorMonetizationPolicyPage />,
});