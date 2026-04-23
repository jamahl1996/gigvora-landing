import { createFileRoute } from '@tanstack/react-router';
import AdminVerificationPage from '@/pages/admin/AdminVerificationPage';
export const Route = createFileRoute('/admin/verification')({
  head: () => ({ meta: [{ title: 'Verification — Admin' }, { name: 'description', content: 'Identity verification queue.' }]}),
  component: () => <AdminVerificationPage />,
});
