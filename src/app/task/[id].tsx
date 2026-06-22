import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTasks } from '@/contexts/tasks-context';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, toggleTaskStatus, deleteTask } = useTasks();
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

  const isCompleted = task.status === 'completed';
  const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleToggle = () => {
    toggleTaskStatus(task.id);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Task Details' }} />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText
              type="subtitle"
              themeColor={isCompleted ? 'textSecondary' : 'text'}
              style={isCompleted && styles.completedTitle}>
              {task.title}
            </ThemedText>
            <ThemedView type="backgroundElement" style={styles.badge}>
              <ThemedText type="small">{isCompleted ? 'Completed' : 'Pending'}</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.section}>
            <ThemedText type="smallBold">Description</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              {task.description.length > 0 ? task.description : 'No description provided.'}
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.section}>
            <ThemedText type="smallBold">Created</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              {formattedDate}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.actions}>
            <Pressable
              onPress={handleToggle}
              style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold" style={styles.primaryButtonText}>
                {isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.button, styles.dangerButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold" style={styles.dangerButtonText}>
                Delete Task
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ScrollView>
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
  content: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.three,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  section: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3C87F7',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  dangerButton: {
    backgroundColor: '#FEECEC',
  },
  dangerButtonText: {
    color: '#E5484D',
  },
  pressed: {
    opacity: 0.7,
  },
});
