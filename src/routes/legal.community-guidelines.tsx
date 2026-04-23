import { createFileRoute } from '@tanstack/react-router';
import CommunityGuidelinesPage from '@/pages/legal/CommunityGuidelinesPage';

export const Route = createFileRoute('/legal/community-guidelines')({
  head: () => ({ meta: [
    { title: 'Community Guidelines — Gigvora' },
    { name: 'description', content: 'The standards every Gigvora member is expected to uphold.' },
    { property: 'og:title', content: 'Community Guidelines — Gigvora' },
    { property: 'og:description', content: 'Standards for behaviour and content on Gigvora.' },
  ]}),
  component: () => <CommunityGuidelinesPage />,
});