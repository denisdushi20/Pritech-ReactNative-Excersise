import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskEmptyState } from '@/components/tasks/task-empty-state';
import { TaskListItem } from '@/components/tasks/task-list-item';
import { TaskListToolbar } from '@/components/tasks/task-list-toolbar';
import { TaskStatsDashboard } from '@/components/tasks/task-stats-dashboard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTasks } from '@/contexts/tasks-context';
import { useTheme } from '@/hooks/use-theme';
import type { TaskFilterStatus } from '@/types/task';
import { formatFilteredTaskSummary } from '@/utils/format-date';
import { filterTasks } from '@/utils/task-filters';

function ItemSeparator() {
  return <ThemedView style={styles.separator} />;
}

function ListHeader({
  tasks,
  searchQuery,
  statusFilter,
  filteredCount,
  onSearchChange,
  onStatusFilterChange,
}: {
  tasks: ReturnType<typeof useTasks>['tasks'];
  searchQuery: string;
  statusFilter: TaskFilterStatus;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: TaskFilterStatus) => void;
}) {
  const filterSummary = formatFilteredTaskSummary(filteredCount, statusFilter, searchQuery);

  return (
    <ThemedView>
      <TaskStatsDashboard
        tasks={tasks}
        activeFilter={statusFilter}
        onFilterChange={onStatusFilterChange}
      />
      {filterSummary && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.filterSummary}>
          {filterSummary}
        </ThemedText>
      )}
      <TaskListToolbar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
      />
    </ThemedView>
  );
}

export default function TaskListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { tasks, isLoading, error, loadTasks, toggleTaskStatus } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskFilterStatus>('all');

  const filteredTasks = useMemo(
    () => filterTasks(tasks, searchQuery, statusFilter),
    [tasks, searchQuery, statusFilter],
  );

  const hasActiveFilters = searchQuery.trim().length > 0 || statusFilter !== 'all';
  const emptyTitle = hasActiveFilters ? 'No matching tasks' : 'No tasks yet';
  const emptySubtitle = hasActiveFilters
    ? 'Try a different search or filter'
    : 'Add a task to get started';

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/task/new')}
              hitSlop={8}
              style={({ pressed }) => [
                styles.addButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Add task"
              accessibilityRole="button">
              <ThemedText type="smallBold" style={styles.addButtonText}>
                +
              </ThemedText>
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {isLoading && tasks.length === 0 ? (
          <ThemedView style={styles.centered}>
            <ActivityIndicator size="large" color={theme.primary} />
          </ThemedView>
        ) : error && tasks.length === 0 ? (
          <ThemedView style={styles.centered}>
            <ThemedText type="default" style={styles.errorText}>
              {error}
            </ThemedText>
            <Pressable onPress={loadTasks} style={({ pressed }) => [pressed && styles.pressed]}>
              <ThemedText type="linkPrimary">Try again</ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskListItem
                task={item}
                onPress={() => router.push({ pathname: '/task/[id]', params: { id: item.id } })}
                onToggleStatus={() => toggleTaskStatus(item.id)}
              />
            )}
            ListHeaderComponent={
              <ListHeader
                tasks={tasks}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                filteredCount={filteredTasks.length}
                onSearchChange={setSearchQuery}
                onStatusFilterChange={setStatusFilter}
              />
            }
            ListEmptyComponent={
              <TaskEmptyState title={emptyTitle} subtitle={emptySubtitle} />
            }
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={loadTasks}
                tintColor={theme.primary}
              />
            }
          />
        )}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  errorText: {
    textAlign: 'center',
  },
  filterSummary: {
    marginBottom: Spacing.two,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  separator: {
    height: Spacing.two,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.one,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.7,
  },
});
