import type { Task, TaskDateFilter, TaskFilterStatus } from '@/types/task';
import { matchesDateFilter } from '@/utils/format-date';

export function filterTasks(
  tasks: Task[],
  searchQuery: string,
  statusFilter: TaskFilterStatus,
  dateFilter: TaskDateFilter = 'all',
): Task[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesDate = matchesDateFilter(task.createdAt, dateFilter);
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch =
      normalizedQuery.length === 0 || task.title.toLowerCase().includes(normalizedQuery);

    return matchesDate && matchesStatus && matchesSearch;
  });
}

export function filterTasksByDate(tasks: Task[], dateFilter: TaskDateFilter): Task[] {
  return tasks.filter((task) => matchesDateFilter(task.createdAt, dateFilter));
}
