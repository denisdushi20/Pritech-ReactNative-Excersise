import type { Task } from '@/types/task';

export function isMockTask(task: Task): boolean {
  if (task.source === 'mock') {
    return true;
  }

  return task.id.startsWith('mock-');
}

export function isApiTask(task: Task): boolean {
  if (task.source === 'api') {
    return true;
  }

  if (task.source === 'mock' || task.source === 'local') {
    return false;
  }

  return /^\d+$/.test(task.id);
}

export function isLocalTask(task: Task): boolean {
  return !isApiTask(task) && !isMockTask(task);
}

/** Ensure persisted tasks keep a reliable source for section grouping. */
export function normalizeTask(task: Task): Task {
  if (isMockTask(task)) {
    return { ...task, source: 'mock' };
  }

  if (isApiTask(task)) {
    return { ...task, source: 'api' };
  }

  return { ...task, source: 'local' };
}

export function normalizeTasks(tasks: Task[]): Task[] {
  return tasks.map(normalizeTask);
}

function mergeSyncedTasks(syncedTasks: Task[], existingTasks: Task[]): Task[] {
  return syncedTasks.map((syncedTask) => {
    const existing = existingTasks.find(
      (task) => task.id === syncedTask.id && task.source === syncedTask.source,
    );

    return existing ? { ...syncedTask, status: existing.status } : syncedTask;
  });
}

export function mergeTasksWithSyncedSources(
  apiTasks: Task[],
  mockTasks: Task[],
  existingTasks: Task[],
): Task[] {
  const normalizedExisting = normalizeTasks(existingTasks);
  const localTasks = normalizedExisting.filter((task) => task.source === 'local');
  const mergedApiTasks = mergeSyncedTasks(apiTasks, normalizedExisting);
  const mergedMockTasks = mergeSyncedTasks(mockTasks, normalizedExisting);

  return [...mergedApiTasks, ...mergedMockTasks, ...localTasks];
}

/** @deprecated Use mergeTasksWithSyncedSources */
export function mergeApiTasksWithLocal(apiTasks: Task[], existingTasks: Task[]): Task[] {
  return mergeTasksWithSyncedSources(apiTasks, [], existingTasks);
}
