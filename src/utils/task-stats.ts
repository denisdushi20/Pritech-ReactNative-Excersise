import type { Task } from '@/types/task';

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  completionRate: number;
}

export function getTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, pending, completed, completionRate };
}
