import { Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskForm } from '@/components/tasks/task-form';
import { ThemedView } from '@/components/themed-view';
import type { CreateTaskInput } from '@/types/task';

export default function AddTaskScreen() {
  const router = useRouter();

  const handleSubmit = (_input: CreateTaskInput) => {
    // Step 7 will persist the task via useTasks
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
