import { createFileRoute } from '@tanstack/react-router';
import CompanyPage from '@/pages/company/CompanyPage';
export const Route = createFileRoute('/company/$companyId')({
  head: () => ({ meta: [{ title: 'Company — Gigvora' }, { name: 'description', content: 'Company profile and openings.' }]}),
  component: () => <CompanyPage />,
});
