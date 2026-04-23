import { createFileRoute } from '@tanstack/react-router';
import EnterpriseProcurementPage from '@/pages/enterprise/EnterpriseProcurementPage';
export const Route = createFileRoute('/enterprise/procurement')({
  head: () => ({ meta: [{ title: 'Enterprise Procurement — Gigvora' }, { name: 'description', content: 'Vendor intelligence and procurement workflows for enterprise buyers.' }]}),
  component: () => <EnterpriseProcurementPage />,
});
