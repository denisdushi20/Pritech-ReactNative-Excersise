import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskEmptyState } from '@/components/tasks/task-empty-state';
import { TaskListItem } from '@/components/tasks/task-list-item';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { MOCK_TASKS } from '@/data/mock-tasks';

function ItemSeparator() {
  return <ThemedView style={styles.separator} />;
}

export default function TaskListScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <FlatList
          data={MOCK_TASKS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskListItem
              task={item}
              onPress={() => router.push({ pathname: '/task/[id]', params: { id: item.id } })}
            />
          )}
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
