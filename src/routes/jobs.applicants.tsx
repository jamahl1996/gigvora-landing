import { createFileRoute } from '@tanstack/react-router';
import JobApplicantsCenterPage from '@/pages/jobs/JobApplicantsCenterPage';
export const Route = createFileRoute('/jobs/applicants')({
  head: () => ({ meta: [{ title: 'Job Applicants — Gigvora' }, { name: 'description', content: 'Triage and review every applicant across your open jobs.' }]}),
  component: () => <JobApplicantsCenterPage />,
});
