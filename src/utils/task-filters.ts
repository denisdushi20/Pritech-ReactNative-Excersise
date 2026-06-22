import type { Task, TaskFilterStatus } from '@/types/task';

export function filterTasks(
  tasks: Task[],
  searchQuery: string,
  statusFilter: TaskFilterStatus,
): Task[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch =
      normalizedQuery.length === 0 || task.title.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesSearch;
  });
}
