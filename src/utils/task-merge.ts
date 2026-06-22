import type { Task } from '@/types/task';

export function isApiTask(task: Task): boolean {
  if (task.source === 'api') {
    return true;
  }

  if (task.source === 'local') {
    return false;
  }

  return /^\d+$/.test(task.id);
}

export function mergeApiTasksWithLocal(apiTasks: Task[], existingTasks: Task[]): Task[] {
  const localTasks = existingTasks.filter((task) => !isApiTask(task));
  return [...localTasks, ...apiTasks];
}
