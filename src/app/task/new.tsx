import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskForm } from '@/components/tasks/task-form';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/contexts/tasks-context';
import type { CreateTaskInput } from '@/types/task';
import { getTodayDateKey } from '@/utils/format-date';

export default function AddTaskScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date?: string }>();
  const { addTask } = useTasks();

  const initialDateKey =
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : getTodayDateKey();

  const handleSubmit = (input: CreateTaskInput) => {
    addTask(input);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Add Task' }} />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <TaskForm
          showDateField
          initialDateKey={initialDateKey}
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
});
