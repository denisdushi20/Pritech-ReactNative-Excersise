import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Task } from '@/types/task';

interface TaskListItemProps {
  task: Task;
  onPress?: () => void;
  onToggleStatus?: () => void;
}

export function TaskListItem({ task, onPress, onToggleStatus }: TaskListItemProps) {
  const isCompleted = task.status === 'completed';
  const formattedDate = new Date(task.createdAt).toLocaleDateString();

  const content = (
    <ThemedView style={styles.row}>
      {onToggleStatus && (
        <Pressable
          onPress={onToggleStatus}
          style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}>
          <ThemedView type="backgroundSelected" style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
            {isCompleted && (
              <ThemedText type="smallBold" style={styles.checkmark}>
                ✓
              </ThemedText>
            )}
          </ThemedView>
        </Pressable>
      )}

      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [styles.content, pressed && onPress && styles.pressed]}>
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
      </Pressable>
    </ThemedView>
  );

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.two,
  },
  toggle: {
    justifyContent: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3C87F7',
  },
  checkmark: {
    color: '#FFFFFF',
    lineHeight: 16,
  },
  content: {
    flex: 1,
  },
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
