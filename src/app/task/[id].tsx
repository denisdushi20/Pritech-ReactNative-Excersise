import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getTaskById } from '@/data/mock-tasks';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
});
