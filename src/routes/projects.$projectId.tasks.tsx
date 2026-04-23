import { createFileRoute } from '@tanstack/react-router';
import TaskBoardPage from '@/pages/projects/TaskBoardPage';
export const Route = createFileRoute('/projects/$projectId/tasks')({
  head: () => ({ meta: [{ title: 'Tasks — Project' }, { name: 'description', content: 'Project task board.' }]}),
  component: () => <TaskBoardPage />,
});
