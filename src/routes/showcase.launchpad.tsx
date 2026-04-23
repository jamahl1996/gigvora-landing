import { createFileRoute } from '@tanstack/react-router';
import ShowcaseLaunchpadPage from '@/pages/showcase/ShowcaseLaunchpadPage';

export const Route = createFileRoute('/showcase/launchpad')({
  head: () => ({ meta: [
    { title: 'Experience Launchpad — Gigvora' },
    { name: 'description', content: 'Career structure for graduates, school leavers, and career changers.' },
    { property: 'og:title', content: 'Experience Launchpad — Gigvora' },
    { property: 'og:description', content: 'Structured early-career experience on Gigvora.' },
  ]}),
  component: () => <ShowcaseLaunchpadPage />,
});