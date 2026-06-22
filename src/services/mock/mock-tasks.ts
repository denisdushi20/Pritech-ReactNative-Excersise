import { startOfDayIso } from '@/utils/format-date';
import type { Task } from '@/types/task';

export function getMockTasks(): Task[] {
  return [
    {
      id: 'mock-1',
      title: 'Buy groceries',
      description: 'Milk, eggs, and bread',
      status: 'pending',
      createdAt: startOfDayIso(0),
      source: 'mock',
    },
    {
      id: 'mock-2',
      title: 'Code today',
      description: 'Work on the React Native task app',
      status: 'pending',
      createdAt: startOfDayIso(0),
      source: 'mock',
    },
    {
      id: 'mock-3',
      title: 'Finish that task today',
      description: 'Wrap up remaining features before EOD',
      status: 'pending',
      createdAt: startOfDayIso(-1),
      source: 'mock',
    },
  ];
}
