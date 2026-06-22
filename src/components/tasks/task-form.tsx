import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CreateTaskInput } from '@/types/task';
import { hasValidationErrors, validateCreateTaskInput } from '@/utils/task-validation';

interface TaskFormProps {
  onSubmit: (input: CreateTaskInput) => void;
  onCancel?: () => void;
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<ReturnType<typeof validateCreateTaskInput>>({});

  const handleSubmit = () => {
    const input: CreateTaskInput = { title, description };
    const validationErrors = validateCreateTaskInput(input);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.field}>
        <ThemedText type="smallBold">Title</ThemedText>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          autoCapitalize="sentences"
          returnKeyType="next"
        />
        {errors.title && (
          <ThemedText type="small" style={styles.error}>
            {errors.title}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.field}>
        <ThemedText type="smallBold">Description</ThemedText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description (optional)"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            styles.textArea,
            { color: theme.text, borderColor: theme.backgroundSelected },
          ]}
          multiline
          textAlignVertical="top"
        />
        {errors.description && (
          <ThemedText type="small" style={styles.error}>
            {errors.description}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.actions}>
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={styles.primaryButtonText}>
            Save Task
          </ThemedText>
        </Pressable>

        {onCancel && (
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold">Cancel</ThemedText>
          </Pressable>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  field: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  error: {
    color: '#E5484D',
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3C87F7',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});
