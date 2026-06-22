import { useCallback, useEffect, useState } from 'react';

import { fetchTasksFromApi } from '@/services/api/tasks-api';
import type { CreateTaskInput, Task } from '@/types/task';

function createTaskId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useTasksState() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTasks = await fetchTasksFromApi();
      setTasks(fetchedTasks);
    } catch {
      setError('Unable to load tasks. Pull to refresh or try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

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
      createdAt: new Date().toISOString(),
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

  return {
    tasks,
    isLoading,
    error,
    loadTasks,
    getTaskById,
    addTask,
    toggleTaskStatus,
    deleteTask,
  };
}

export type TasksContextValue = ReturnType<typeof useTasksState>;
