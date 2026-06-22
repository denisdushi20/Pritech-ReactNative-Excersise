import { startOfDayIso } from '@/utils/format-date';
import type { ApiTodo, Task } from '@/types/task';

export const TASKS_API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=3';

export function mapApiTodoToTask(todo: ApiTodo): Task {
  return {
    id: String(todo.id),
    title: todo.title,
    description: '',
    status: todo.completed ? 'completed' : 'pending',
    createdAt: startOfDayIso(0),
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
