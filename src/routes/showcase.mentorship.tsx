import { createFileRoute } from '@tanstack/react-router';
import ShowcaseMentorshipPage from '@/pages/showcase/ShowcaseMentorshipPage';

export const Route = createFileRoute('/showcase/mentorship')({
  head: () => ({ meta: [
    { title: 'Mentorship — Gigvora' },
    { name: 'description', content: 'Find a mentor or become one — structured mentorship on Gigvora.' },
    { property: 'og:title', content: 'Mentorship — Gigvora' },
    { property: 'og:description', content: 'Mentor and mentee matching on Gigvora.' },
  ]}),
  component: () => <ShowcaseMentorshipPage />,
});