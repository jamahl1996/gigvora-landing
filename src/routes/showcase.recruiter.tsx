import { createFileRoute } from '@tanstack/react-router';
import ShowcaseRecruiterPage from '@/pages/showcase/ShowcaseRecruiterPage';

export const Route = createFileRoute('/showcase/recruiter')({
  head: () => ({ meta: [
    { title: 'Recruiter Suite — Gigvora' },
    { name: 'description', content: 'A modern hiring stack: ATS, sourcing, scorecards, and interview scheduling.' },
    { property: 'og:title', content: 'Recruiter Suite — Gigvora' },
    { property: 'og:description', content: 'End-to-end hiring on Gigvora.' },
  ]}),
  component: () => <ShowcaseRecruiterPage />,
});