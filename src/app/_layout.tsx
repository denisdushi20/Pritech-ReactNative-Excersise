import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Tasks' }} />
      <Stack.Screen name="task/[id]" options={{ title: 'Task Details' }} />
    </Stack>
  );
}
