import { startOfDayIso } from '@/utils/format-date';
import type { ApiTodo, Task } from '@/types/task';

export const TASKS_API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=3';

const ENGLISH_TASK_CONTENT = [
  {
    title: 'Buy groceries',
    description: 'Milk, eggs, and bread',
    dayOffset: 0,
  },
  {
    title: 'Code today',
    description: 'Work on the React Native task app',
    dayOffset: 0,
  },
  {
    title: 'Finish that task today',
    description: 'Wrap up remaining features before EOD',
    dayOffset: -1,
  },
] as const;

export function mapApiTodoToTask(todo: ApiTodo, index: number): Task {
  const content = ENGLISH_TASK_CONTENT[index] ?? ENGLISH_TASK_CONTENT[0];

  return {
    id: String(todo.id),
    title: content.title,
    description: content.description,
    status: todo.completed ? 'completed' : 'pending',
    createdAt: startOfDayIso(content.dayOffset),
    source: 'api',
  };
}

export async function fetchTasksFromApi(): Promise<Task[]> {
  const response = await fetch(TASKS_API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks from the API.');
  }

  const data = (await response.json()) as ApiTodo[];
  return data.map(mapApiTodoToTask);
}
