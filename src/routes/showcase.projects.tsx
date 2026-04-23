import { createFileRoute } from '@tanstack/react-router';
import ShowcaseProjectsPage from '@/pages/showcase/ShowcaseProjectsPage';

export const Route = createFileRoute('/showcase/projects')({
  head: () => ({ meta: [
    { title: 'Projects Marketplace — Gigvora' },
    { name: 'description', content: 'Browse open project briefs and submit proposals on Gigvora.' },
    { property: 'og:title', content: 'Projects — Gigvora' },
    { property: 'og:description', content: 'Open project briefs across every category.' },
  ]}),
  component: () => <ShowcaseProjectsPage />,
});