import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskEmptyState } from '@/components/tasks/task-empty-state';
import { TaskListItem } from '@/components/tasks/task-list-item';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Task } from '@/types/task';

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread',
    status: 'pending',
    createdAt: '2026-06-20T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Finish React Native exercise',
    description: 'Build task list, details, and add flow',
    status: 'pending',
    createdAt: '2026-06-21T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Review pull request',
    description: 'Check code structure and UI clarity',
    status: 'completed',
    createdAt: '2026-06-18T09:15:00.000Z',
  },
  {
    id: '4',
    title: 'Update README',
    description: 'Add setup instructions and screenshots',
    status: 'completed',
    createdAt: '2026-06-19T16:45:00.000Z',
  },
];

function ItemSeparator() {
  return <ThemedView style={styles.separator} />;
}

export default function TaskListScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <FlatList
          data={MOCK_TASKS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskListItem task={item} />}
          ListEmptyComponent={TaskEmptyState}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContent}
        />
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
  listContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  separator: {
    height: Spacing.two,
  },
});
