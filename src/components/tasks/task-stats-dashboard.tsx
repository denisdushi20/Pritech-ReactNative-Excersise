import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Task, TaskFilterStatus } from '@/types/task';
import { getTaskStats } from '@/utils/task-stats';

interface TaskStatsDashboardProps {
  tasks: Task[];
  activeFilter: TaskFilterStatus;
  onFilterChange: (filter: TaskFilterStatus) => void;
}

interface StatCardProps {
  label: string;
  value: number;
  accentColor: string;
  surfaceColor: string;
  isActive: boolean;
  accessibilityLabel: string;
  onPress: () => void;
}

function StatCard({
  label,
  value,
  accentColor,
  surfaceColor,
  isActive,
  accessibilityLabel,
  onPress,
}: StatCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.statCardWrapper, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: isActive }}>
      <ThemedView
        type="card"
        style={[
          styles.statCard,
          CardShadow,
          {
            borderColor: isActive ? theme.primary : surfaceColor,
            backgroundColor: isActive ? theme.backgroundElement : theme.card,
          },
          isActive && { borderWidth: 2 },
        ]}>
        <ThemedText type="title" style={[styles.statValue, { color: accentColor }]}>
          {value}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function TaskStatsDashboard({ tasks, activeFilter, onFilterChange }: TaskStatsDashboardProps) {
  const theme = useTheme();
  const { total, pending, completed, completionRate } = getTaskStats(tasks);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.statsRow}>
        <StatCard
          label="Total"
          value={total}
          accentColor={theme.primary}
          surfaceColor={theme.border}
          isActive={activeFilter === 'all'}
          accessibilityLabel="Show all tasks"
          onPress={() => onFilterChange('all')}
        />
        <StatCard
          label="Pending"
          value={pending}
          accentColor={theme.warning}
          surfaceColor={theme.warningSurface}
          isActive={activeFilter === 'pending'}
          accessibilityLabel="Show pending tasks"
          onPress={() => onFilterChange('pending')}
        />
        <StatCard
          label="Done"
          value={completed}
          accentColor={theme.success}
          surfaceColor={theme.successSurface}
          isActive={activeFilter === 'completed'}
          accessibilityLabel="Show completed tasks"
          onPress={() => onFilterChange('completed')}
        />
      </ThemedView>

      <ThemedView type="card" style={[styles.progressCard, CardShadow]}>
        <ThemedView style={styles.progressHeader}>
          <ThemedText type="smallBold">Completion rate</ThemedText>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            {completionRate}%
          </ThemedText>
        </ThemedView>
        <ThemedView style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${completionRate}%`,
                backgroundColor: theme.primary,
              },
            ]}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statCardWrapper: {
    flex: 1,
  },
  statCard: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statValue: {
    fontSize: 28,
    lineHeight: 32,
  },
  progressCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: Spacing.one,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
