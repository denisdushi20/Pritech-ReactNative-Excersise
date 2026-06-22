import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskEmptyState } from '@/components/tasks/task-empty-state';
import { TaskListItem } from '@/components/tasks/task-list-item';
import { TaskListToolbar } from '@/components/tasks/task-list-toolbar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTasks } from '@/contexts/tasks-context';
import type { TaskFilterStatus } from '@/types/task';
import { filterTasks } from '@/utils/task-filters';

function ItemSeparator() {
  return <ThemedView style={styles.separator} />;
}

export default function TaskListScreen() {
  const router = useRouter();
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
              style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <ThemedText type="linkPrimary">Add</ThemedText>
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {isLoading && tasks.length === 0 ? (
          <ThemedView style={styles.centered}>
            <ActivityIndicator size="large" />
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
              <TaskListToolbar
                searchQuery={searchQuery}
                statusFilter={statusFilter}
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
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadTasks} />}
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
  listContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  separator: {
    height: Spacing.two,
  },
  addButton: {
    paddingHorizontal: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
