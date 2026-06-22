import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TaskFilterStatus } from '@/types/task';

const FILTER_OPTIONS: { label: string; value: TaskFilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

interface TaskListToolbarProps {
  searchQuery: string;
  statusFilter: TaskFilterStatus;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: TaskFilterStatus) => void;
}

export function TaskListToolbar({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: TaskListToolbarProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <TextInput
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Search by title"
        placeholderTextColor={theme.textSecondary}
        style={[styles.searchInput, { color: theme.text, borderColor: theme.backgroundSelected }]}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      <ThemedView style={styles.filters}>
        {FILTER_OPTIONS.map((option) => {
          const isActive = statusFilter === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onStatusFilterChange(option.value)}
              style={({ pressed }) => [pressed && styles.pressed]}>
              <ThemedView
                type={isActive ? undefined : 'backgroundElement'}
                style={[styles.filterChip, isActive && styles.filterChipActive]}>
                <ThemedText type="small" style={isActive && styles.filterChipTextActive}>
                  {option.label}
                </ThemedText>
              </ThemedView>
            </Pressable>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  filterChip: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  filterChipActive: {
    backgroundColor: '#3C87F7',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.7,
  },
});
