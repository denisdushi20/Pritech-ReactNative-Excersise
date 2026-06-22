import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CreateTaskInput } from '@/types/task';
import { dateKeyToDate, formatDateKeyLong, getTodayDateKey, toDateKey } from '@/utils/format-date';
import { hasValidationErrors, validateCreateTaskInput } from '@/utils/task-validation';

interface TaskFormProps {
  initialValues?: CreateTaskInput;
  initialDateKey?: string;
  showDateField?: boolean;
  submitLabel?: string;
  onSubmit: (input: CreateTaskInput) => void;
  onCancel?: () => void;
}

export function TaskForm({
  initialValues,
  initialDateKey,
  showDateField = false,
  submitLabel = 'Save Task',
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const theme = useTheme();
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [dateKey, setDateKey] = useState(initialDateKey ?? getTodayDateKey());
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<ReturnType<typeof validateCreateTaskInput>>({});

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      setDateKey(toDateKey(selectedDate.toISOString()));
    }
  };

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
      ...(showDateField ? { dateKey } : {}),
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
      {showDateField && (
        <ThemedView style={styles.field}>
          <ThemedText type="smallBold">Date</ThemedText>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={({ pressed }) => [
              styles.dateRow,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="default">{formatDateKeyLong(dateKey)}</ThemedText>
            <ThemedText type="linkPrimary">Change</ThemedText>
          </Pressable>
          {showPicker && (
            <ThemedView style={styles.pickerContainer}>
              <DateTimePicker
                value={dateKeyToDate(dateKey)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
              {Platform.OS === 'ios' && (
                <Pressable
                  onPress={() => setShowPicker(false)}
                  style={({ pressed }) => [
                    styles.doneButton,
                    { backgroundColor: theme.primary },
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText type="smallBold" style={{ color: theme.primaryText }}>
                    Done
                  </ThemedText>
                </Pressable>
              )}
            </ThemedView>
          )}
        </ThemedView>
      )}

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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pickerContainer: {
    gap: Spacing.two,
  },
  doneButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
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
