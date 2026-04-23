import { createFileRoute } from '@tanstack/react-router';
import ShowcaseEventsPage from '@/pages/showcase/ShowcaseEventsPage';

export const Route = createFileRoute('/showcase/events')({
  head: () => ({ meta: [
    { title: 'Events — Gigvora' },
    { name: 'description', content: 'Host and attend professional events, webinars, and meetups on Gigvora.' },
    { property: 'og:title', content: 'Events — Gigvora' },
    { property: 'og:description', content: 'Professional events on Gigvora.' },
  ]}),
  component: () => <ShowcaseEventsPage />,
});