import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CreateTaskInput } from '@/types/task';
import { hasValidationErrors, validateCreateTaskInput } from '@/utils/task-validation';

interface TaskFormProps {
  initialValues?: CreateTaskInput;
  submitLabel?: string;
  onSubmit: (input: CreateTaskInput) => void;
  onCancel?: () => void;
}

export function TaskForm({
  initialValues,
  submitLabel = 'Save Task',
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const theme = useTheme();
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
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

  const inputStyle = [
    styles.input,
    {
      color: theme.text,
      backgroundColor: theme.card,
      borderColor: theme.border,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.field}>
        <ThemedText type="smallBold">Title</ThemedText>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
          autoCapitalize="sentences"
          returnKeyType="next"
        />
        {errors.title && (
          <ThemedText type="small" style={{ color: theme.danger }}>
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
          style={[...inputStyle, styles.textArea]}
          multiline
          textAlignVertical="top"
        />
        {errors.description && (
          <ThemedText type="small" style={{ color: theme.danger }}>
            {errors.description}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.actions}>
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" style={{ color: theme.primaryText }}>
            {submitLabel}
          </ThemedText>
        </Pressable>

        {onCancel && (
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              { borderColor: theme.border },
              pressed && styles.pressed,
            ]}>
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
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  button: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
