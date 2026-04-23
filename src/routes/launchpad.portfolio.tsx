import { createFileRoute } from '@tanstack/react-router';
import PortfolioBuilderPage from '@/pages/launchpad/PortfolioBuilderPage';
export const Route = createFileRoute('/launchpad/portfolio')({
  head: () => ({ meta: [{ title: 'Portfolio — Launchpad' }, { name: 'description', content: 'Build your career portfolio.' }]}),
  component: () => <PortfolioBuilderPage />,
});
