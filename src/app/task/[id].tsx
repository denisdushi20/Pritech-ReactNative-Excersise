import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTasks } from '@/contexts/tasks-context';
import { useTheme } from '@/hooks/use-theme';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
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

  const statusSurface = isCompleted ? theme.successSurface : theme.warningSurface;
  const statusColor = isCompleted ? theme.success : theme.warning;

  const handleToggle = () => {
    toggleTaskStatus(task.id);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    router.back();
  };

  const handleEdit = () => {
    router.push({ pathname: '/task/[id]/edit', params: { id: task.id } });
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Task Details' }} />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedView type="card" style={[styles.headerCard, CardShadow, { borderColor: theme.border }]}>
            <ThemedText
              type="subtitle"
              themeColor={isCompleted ? 'textSecondary' : 'text'}
              style={[styles.taskTitle, isCompleted && styles.completedTitle]}>
              {task.title}
            </ThemedText>
            <ThemedView style={[styles.badge, { backgroundColor: statusSurface }]}>
              <ThemedText type="small" style={{ color: statusColor }}>
                {isCompleted ? 'Completed' : 'Pending'}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView type="card" style={[styles.section, CardShadow, { borderColor: theme.border }]}>
            <ThemedText type="smallBold">Description</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              {task.description.length > 0 ? task.description : 'No description provided.'}
            </ThemedText>
          </ThemedView>

          <ThemedView type="card" style={[styles.section, CardShadow, { borderColor: theme.border }]}>
            <ThemedText type="smallBold">Created</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              {formattedDate}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.actions}>
            <Pressable
              onPress={handleEdit}
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                { borderColor: theme.border },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold">Edit Task</ThemedText>
            </Pressable>

            <Pressable
              onPress={handleToggle}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={{ color: theme.primaryText }}>
                {isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.dangerSurface },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={{ color: theme.danger }}>
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
  headerCard: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  taskTitle: {
    fontSize: 24,
    lineHeight: 30,
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
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  button: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
