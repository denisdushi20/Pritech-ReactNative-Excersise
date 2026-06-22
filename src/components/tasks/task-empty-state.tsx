import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function TaskEmptyState() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">No tasks yet</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
        Add a task to get started
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.six,
  },
  subtitle: {
    textAlign: 'center',
  },
});
