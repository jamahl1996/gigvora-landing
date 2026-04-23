import { createFileRoute } from '@tanstack/react-router';
import InternalAuditPage from '@/pages/admin/InternalAuditPage';
export const Route = createFileRoute('/admin/audit')({
  head: () => ({ meta: [{ title: 'Audit Log — Admin' }, { name: 'description', content: 'Immutable audit log of admin actions.' }]}),
  component: () => <InternalAuditPage />,
});
