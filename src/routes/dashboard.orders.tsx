import { createFileRoute } from '@tanstack/react-router';
import DashboardOrdersPage from '@/pages/dashboard/DashboardOrdersPage';

export const Route = createFileRoute('/dashboard/orders')({
  head: () => ({ meta: [
    { title: 'Orders — Dashboard — Gigvora' },
    { name: 'description', content: 'Orders you have placed and orders you are fulfilling.' },
  ]}),
  component: () => <DashboardOrdersPage />,
});