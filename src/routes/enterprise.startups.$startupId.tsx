import { createFileRoute } from '@tanstack/react-router';
import StartupDetailPage from '@/pages/enterprise/StartupDetailPage';
export const Route = createFileRoute('/enterprise/startups/$startupId')({
  head: () => ({ meta: [{ title: 'Startup — Enterprise' }, { name: 'description', content: 'Startup detail and signals.' }]}),
  component: () => <StartupDetailPage />,
});
