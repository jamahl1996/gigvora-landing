import { createFileRoute } from '@tanstack/react-router';
import EnterpriseHiringWorkspacePage from '@/pages/enterprise/EnterpriseHiringWorkspacePage';
export const Route = createFileRoute('/enterprise/hiring')({
  head: () => ({ meta: [{ title: 'Enterprise Hiring — Gigvora' }, { name: 'description', content: 'Centralized hiring workspace for enterprise talent acquisition.' }]}),
  component: () => <EnterpriseHiringWorkspacePage />,
});
