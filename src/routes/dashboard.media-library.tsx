import { createFileRoute } from '@tanstack/react-router';
import DashboardMediaLibraryPage from '@/pages/dashboard/DashboardMediaLibraryPage';

export const Route = createFileRoute('/dashboard/media-library')({
  head: () => ({ meta: [
    { title: 'Media Library — Dashboard — Gigvora' },
    { name: 'description', content: 'All your uploaded images, videos, and audio in one library.' },
  ]}),
  component: () => <DashboardMediaLibraryPage />,
});