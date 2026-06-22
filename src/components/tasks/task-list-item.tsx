import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Task } from '@/types/task';
import { formatRelativeDate } from '@/utils/format-date';

interface TaskListItemProps {
  task: Task;
  onPress?: () => void;
  onToggleStatus?: () => void;
}

export function TaskListItem({ task, onPress, onToggleStatus }: TaskListItemProps) {
  const theme = useTheme();
  const isCompleted = task.status === 'completed';
  const formattedDate = formatRelativeDate(task.createdAt);

  const statusSurface = isCompleted ? theme.successSurface : theme.warningSurface;
  const statusColor = isCompleted ? theme.success : theme.warning;

  return (
    <ThemedView style={styles.row}>
      {onToggleStatus && (
        <Pressable
          onPress={onToggleStatus}
          style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}>
          <ThemedView
            style={[
              styles.checkbox,
              { borderColor: theme.border },
              isCompleted && { backgroundColor: theme.primary, borderColor: theme.primary },
            ]}>
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
        <ThemedView type="card" style={[styles.card, CardShadow, { borderColor: theme.border }]}>
          <ThemedView style={styles.header}>
            <ThemedText
              type="default"
              themeColor={isCompleted ? 'textSecondary' : 'text'}
              style={[styles.title, isCompleted && styles.completedTitle]}
              numberOfLines={1}>
              {task.title}
            </ThemedText>
            <ThemedView style={[styles.badge, { backgroundColor: statusSurface }]}>
              <ThemedText type="small" style={{ color: statusColor }}>
                {isCompleted ? 'Completed' : 'Pending'}
              </ThemedText>
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
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderWidth: 1,
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
