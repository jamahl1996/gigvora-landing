import { createFileRoute } from '@tanstack/react-router';
import AssetLibraryPage from '@/pages/creation-studio/AssetLibraryPage';
export const Route = createFileRoute('/creation-studio/assets')({
  head: () => ({ meta: [{ title: 'Asset Library — Creation Studio' }, { name: 'description', content: 'Reusable images, videos, and audio for every content workflow.' }]}),
  component: () => <AssetLibraryPage />,
});
