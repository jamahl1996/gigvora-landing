import { createFileRoute } from '@tanstack/react-router';
import ShowcaseEnterprisePage from '@/pages/showcase/ShowcaseEnterprisePage';

export const Route = createFileRoute('/showcase/enterprise')({
  head: () => ({ meta: [
    { title: 'Enterprise — Gigvora' },
    { name: 'description', content: 'SSO, SCIM, audit logs, and procurement controls for enterprise teams.' },
    { property: 'og:title', content: 'Enterprise — Gigvora' },
    { property: 'og:description', content: 'Enterprise-grade controls for procurement and hiring.' },
  ]}),
  component: () => <ShowcaseEnterprisePage />,
});