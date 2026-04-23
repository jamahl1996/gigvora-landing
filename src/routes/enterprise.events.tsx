import { createFileRoute } from '@tanstack/react-router';
import EnterpriseEventsPage from '@/pages/enterprise/EnterpriseEventsPage';
export const Route = createFileRoute('/enterprise/events')({
  head: () => ({ meta: [{ title: 'Enterprise Events — Gigvora' }, { name: 'description', content: 'Curated executive events, summits, and roundtables.' }]}),
  component: () => <EnterpriseEventsPage />,
});
