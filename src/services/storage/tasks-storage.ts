import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Task } from '@/types/task';

const TASKS_STORAGE_KEY = '@pritech/tasks-v2';

export async function loadTasksFromStorage(): Promise<Task[]> {
  const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

  if (!storedTasks) {
    return [];
  }

  return JSON.parse(storedTasks) as Task[];
}

export async function saveTasksToStorage(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}
