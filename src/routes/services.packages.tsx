import { createFileRoute } from '@tanstack/react-router';
import ServicePackagesBuilderPage from '@/pages/services/ServicePackagesBuilderPage';
export const Route = createFileRoute('/services/packages')({
  head: () => ({ meta: [{ title: 'Service Packages — Gigvora' }, { name: 'description', content: 'Configure hourly, retainer, and project pricing for your services.' }]}),
  component: () => <ServicePackagesBuilderPage />,
});
