import { Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskForm } from '@/components/tasks/task-form';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/contexts/tasks-context';
import type { CreateTaskInput } from '@/types/task';

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTask } = useTasks();

  const handleSubmit = (input: CreateTaskInput) => {
    addTask(input);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Add Task' }} />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <TaskForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
