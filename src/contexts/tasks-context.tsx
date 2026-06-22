import { createContext, useContext, type ReactNode } from 'react';

import { useTasksState, type TasksContextValue } from '@/hooks/use-tasks';

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const value = useTasksState();

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider.');
  }

  return context;
}
