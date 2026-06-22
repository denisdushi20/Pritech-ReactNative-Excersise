import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

interface TaskListSectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function TaskListSectionHeader({ title, subtitle }: TaskListSectionHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="smallBold" themeColor="text">
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText type="small" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.half,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
});
