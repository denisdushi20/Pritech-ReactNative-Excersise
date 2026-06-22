import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskDateFilterBar } from '@/components/tasks/task-date-filter';
import { TaskEmptyState } from '@/components/tasks/task-empty-state';
import { TaskListItem } from '@/components/tasks/task-list-item';
import { TaskListToolbar } from '@/components/tasks/task-list-toolbar';
import { TaskStatsDashboard } from '@/components/tasks/task-stats-dashboard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTasks } from '@/contexts/tasks-context';
import { useTheme } from '@/hooks/use-theme';
import type { TaskDateFilter, TaskFilterStatus } from '@/types/task';
import {
  formatFilteredTaskSummary,
  formatLastApiSync,
  getTodayDateKey,
  hasActiveDateFilter,
  isSpecificDateFilter,
  startOfDayIso,
  toDateKey,
} from '@/utils/format-date';
import { filterTasks, filterTasksByDate } from '@/utils/task-filters';

function ItemSeparator() {
  return <ThemedView style={styles.separator} />;
}

function ListHeader({
  tasks,
  dateFilteredTasks,
  searchQuery,
  statusFilter,
  dateFilter,
  filteredCount,
  lastApiSyncAt,
  onSearchChange,
  onStatusFilterChange,
  onDateFilterChange,
}: {
  tasks: ReturnType<typeof useTasks>['tasks'];
  dateFilteredTasks: ReturnType<typeof useTasks>['tasks'];
  searchQuery: string;
  statusFilter: TaskFilterStatus;
  dateFilter: TaskDateFilter;
  filteredCount: number;
  lastApiSyncAt: string | null;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: TaskFilterStatus) => void;
  onDateFilterChange: (value: TaskDateFilter) => void;
}) {
  const filterSummary = formatFilteredTaskSummary(
    filteredCount,
    statusFilter,
    searchQuery,
    dateFilter,
  );
  const apiSyncLabel = formatLastApiSync(lastApiSyncAt);

  return (
    <ThemedView>
      <TaskStatsDashboard
        tasks={dateFilteredTasks}
        activeFilter={statusFilter}
        onFilterChange={onStatusFilterChange}
      />
      {apiSyncLabel && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.apiSyncLabel}>
          {apiSyncLabel}
        </ThemedText>
      )}
      <TaskDateFilterBar
        tasks={tasks}
        dateFilter={dateFilter}
        onDateFilterChange={onDateFilterChange}
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
  const { tasks, isLoading, error, lastApiSyncAt, loadTasks, toggleTaskStatus } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskFilterStatus>('all');
  const [dateFilter, setDateFilter] = useState<TaskDateFilter>('all');

  const dateFilteredTasks = useMemo(
    () => filterTasksByDate(tasks, dateFilter),
    [tasks, dateFilter],
  );

  const filteredTasks = useMemo(
    () => filterTasks(dateFilteredTasks, searchQuery, statusFilter, 'all'),
    [dateFilteredTasks, searchQuery, statusFilter],
  );

  const hasActiveFilters =
    searchQuery.trim().length > 0 || statusFilter !== 'all' || hasActiveDateFilter(dateFilter);

  const handleAddTask = () => {
    if (isSpecificDateFilter(dateFilter)) {
      router.push({ pathname: '/task/new', params: { date: dateFilter.dateKey } });
      return;
    }

    if (dateFilter === 'today') {
      router.push({ pathname: '/task/new', params: { date: getTodayDateKey() } });
      return;
    }

    if (dateFilter === 'yesterday') {
      router.push({ pathname: '/task/new', params: { date: toDateKey(startOfDayIso(-1)) } });
      return;
    }

    router.push('/task/new');
  };
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
              onPress={handleAddTask}
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
                dateFilteredTasks={dateFilteredTasks}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                dateFilter={dateFilter}
                filteredCount={filteredTasks.length}
                lastApiSyncAt={lastApiSyncAt}
                onSearchChange={setSearchQuery}
                onStatusFilterChange={setStatusFilter}
                onDateFilterChange={setDateFilter}
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
  apiSyncLabel: {
    marginBottom: Spacing.two,
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
