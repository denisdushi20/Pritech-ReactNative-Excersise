import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Task } from '@/types/task';
import { normalizeTasks } from '@/utils/task-merge';

const TASKS_STORAGE_KEY = '@pritech/tasks-v3';
const LAST_API_SYNC_KEY = '@pritech/last-api-sync';

export async function loadTasksFromStorage(): Promise<Task[]> {
  const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

  if (!storedTasks) {
    return [];
  }

  return normalizeTasks(JSON.parse(storedTasks) as Task[]);
}

export async function saveTasksToStorage(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(normalizeTasks(tasks)));
}

export async function loadLastApiSyncFromStorage(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_API_SYNC_KEY);
}

export async function saveLastApiSyncToStorage(isoDate: string): Promise<void> {
  await AsyncStorage.setItem(LAST_API_SYNC_KEY, isoDate);
}
