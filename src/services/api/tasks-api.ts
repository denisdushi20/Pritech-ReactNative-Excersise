import type { ApiTodo, Task } from '@/types/task';

const TASKS_API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=15';

export function mapApiTodoToTask(todo: ApiTodo): Task {
  return {
    id: String(todo.id),
    title: todo.title.charAt(0).toUpperCase() + todo.title.slice(1),
    description: '',
    status: todo.completed ? 'completed' : 'pending',
    createdAt: new Date(Date.now() - todo.id * 86_400_000).toISOString(),
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
