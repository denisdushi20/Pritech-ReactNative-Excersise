import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchTasksFromApi } from '@/services/api/tasks-api';
import { loadTasksFromStorage, saveTasksToStorage } from '@/services/storage/tasks-storage';
import type { CreateTaskInput, Task } from '@/types/task';
import { dateKeyToIso } from '@/utils/format-date';
import { mergeApiTasksWithLocal } from '@/utils/task-merge';

function createTaskId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useTasksState() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastApiSyncAt, setLastApiSyncAt] = useState<string | null>(null);
  const hasHydrated = useRef(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const storedTasks = await loadTasksFromStorage().catch(() => [] as Task[]);

    try {
      const apiTasks = await fetchTasksFromApi();

      setTasks((currentTasks) => {
        const mergeBase = storedTasks.length > 0 ? storedTasks : currentTasks;
        return mergeApiTasksWithLocal(apiTasks, mergeBase);
      });

      setLastApiSyncAt(new Date().toISOString());
    } catch {
      if (storedTasks.length > 0) {
        setTasks(storedTasks);
        setError('Unable to sync from API. Showing saved tasks.');
      } else {
        setError('Unable to load tasks. Pull to refresh or try again.');
      }
    } finally {
      setIsLoading(false);
      hasHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveTasksToStorage(tasks).catch(() => {
      setError('Unable to save tasks locally.');
    });
  }, [tasks]);

  const getTaskById = useCallback(
    (id: string) => tasks.find((task) => task.id === id),
    [tasks],
  );

  const addTask = useCallback((input: CreateTaskInput) => {
    const newTask: Task = {
      id: createTaskId(),
      title: input.title,
      description: input.description,
      status: 'pending',
      createdAt: input.dateKey ? dateKeyToIso(input.dateKey) : new Date().toISOString(),
      source: 'local',
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }, []);

  const updateTask = useCallback((id: string, input: CreateTaskInput) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, title: input.title, description: input.description }
          : task,
      ),
    );
  }, []);

  return {
    tasks,
    isLoading,
    error,
    lastApiSyncAt,
    loadTasks,
    getTaskById,
    addTask,
    toggleTaskStatus,
    deleteTask,
    updateTask,
  };
}

export type TasksContextValue = ReturnType<typeof useTasksState>;
