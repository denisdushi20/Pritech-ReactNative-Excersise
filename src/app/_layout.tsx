import { Stack } from 'expo-router';

import { TasksProvider } from '@/contexts/tasks-context';

export default function RootLayout() {
  return (
    <TasksProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Tasks' }} />
        <Stack.Screen name="task/new" options={{ title: 'Add Task' }} />
        <Stack.Screen name="task/[id]" options={{ title: 'Task Details' }} />
      </Stack>
    </TasksProvider>
  );
}
