import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskForm } from '@/components/tasks/task-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTasks } from '@/contexts/tasks-context';
import type { CreateTaskInput } from '@/types/task';

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, updateTask } = useTasks();
  const task = typeof id === 'string' ? getTaskById(id) : undefined;

  if (!task) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <SafeAreaView style={styles.notFound}>
          <ThemedText type="default">Task not found.</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const handleSubmit = (input: CreateTaskInput) => {
    updateTask(task.id, input);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Edit Task' }} />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <TaskForm
          initialValues={{ title: task.title, description: task.description }}
          submitLabel="Update Task"
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
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
  notFound: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
});
