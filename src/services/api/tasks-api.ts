import type { ApiTodo, Task } from '@/types/task';

const TASKS_API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=3';

const ENGLISH_TASK_CONTENT = [
  {
    title: 'Buy groceries',
    description: 'Milk, eggs, and bread',
  },
  {
    title: 'Finish React Native exercise',
    description: 'Complete the task list and details screens',
  },
  {
    title: 'Update README',
    description: 'Add setup instructions and screenshots',
  },
] as const;

export function mapApiTodoToTask(todo: ApiTodo, index: number): Task {
  const content = ENGLISH_TASK_CONTENT[index] ?? ENGLISH_TASK_CONTENT[0];

  return {
    id: String(todo.id),
    title: content.title,
    description: content.description,
    status: todo.completed ? 'completed' : 'pending',
    createdAt: new Date(Date.now() - (index + 1) * 86_400_000).toISOString(),
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
