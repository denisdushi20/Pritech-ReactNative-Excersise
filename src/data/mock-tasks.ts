import type { Task } from '@/types/task';

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread',
    status: 'pending',
    createdAt: '2026-06-20T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Finish React Native exercise',
    description: 'Build task list, details, and add flow',
    status: 'pending',
    createdAt: '2026-06-21T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Review pull request',
    description: 'Check code structure and UI clarity',
    status: 'completed',
    createdAt: '2026-06-18T09:15:00.000Z',
  },
  {
    id: '4',
    title: 'Update README',
    description: 'Add setup instructions and screenshots',
    status: 'completed',
    createdAt: '2026-06-19T16:45:00.000Z',
  },
];

export function getTaskById(id: string): Task | undefined {
  return MOCK_TASKS.find((task) => task.id === id);
}
