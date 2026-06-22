import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Task } from '@/types/task';

interface TaskListItemProps {
  task: Task;
  onPress?: () => void;
}

export function TaskListItem({ task, onPress }: TaskListItemProps) {
  const isCompleted = task.status === 'completed';
  const formattedDate = new Date(task.createdAt).toLocaleDateString();

  const card = (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedText
          type="default"
          themeColor={isCompleted ? 'textSecondary' : 'text'}
          style={[styles.title, isCompleted && styles.completedTitle]}
          numberOfLines={1}>
          {task.title}
        </ThemedText>
        <ThemedView type="backgroundSelected" style={styles.badge}>
          <ThemedText type="small">{isCompleted ? 'Completed' : 'Pending'}</ThemedText>
        </ThemedView>
      </ThemedView>

      {task.description.length > 0 && (
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {task.description}
        </ThemedText>
      )}

      <ThemedText type="small" themeColor="textSecondary">
        {formattedDate}
      </ThemedText>
    </ThemedView>
  );

  if (!onPress) {
    return card;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      {card}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  badge: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  pressed: {
    opacity: 0.7,
  },
});
