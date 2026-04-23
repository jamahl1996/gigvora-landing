import { createFileRoute } from '@tanstack/react-router';
import ShowcaseNavigatorPage from '@/pages/showcase/ShowcaseNavigatorPage';

export const Route = createFileRoute('/showcase/navigator')({
  head: () => ({ meta: [
    { title: 'Sales Navigator — Gigvora' },
    { name: 'description', content: 'Outbound prospecting, account intelligence, and pipeline tracking on Gigvora.' },
    { property: 'og:title', content: 'Sales Navigator — Gigvora' },
    { property: 'og:description', content: 'A modern sales prospecting suite.' },
  ]}),
  component: () => <ShowcaseNavigatorPage />,
});