import { createFileRoute } from '@tanstack/react-router';
import HireTalentPoolsPage from '@/pages/hire/HireTalentPoolsPage';

export const Route = createFileRoute('/hire/talent-pools')({
  head: () => ({ meta: [
    { title: 'Talent Pools — Hire — Gigvora' },
    { name: 'description', content: 'Curated talent pools for proactive sourcing on Gigvora.' },
  ]}),
  component: () => <HireTalentPoolsPage />,
});
