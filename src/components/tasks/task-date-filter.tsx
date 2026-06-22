import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Task, TaskDateFilter } from '@/types/task';
import {
  formatDateKeyLabel,
  getDateKeysInRange,
  getTaskCountByDateKey,
  getTodayDateKey,
  isSpecificDateFilter,
  startOfDayIso,
  toDateKey,
} from '@/utils/format-date';

const STRIP_START_OFFSET = -7;
const STRIP_END_OFFSET = 6;
const DAY_CELL_WIDTH = 52;

const DATE_FILTER_OPTIONS: { label: string; value: TaskDateFilter }[] = [
  { label: 'All dates', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
];

interface TaskDateFilterBarProps {
  tasks: Task[];
  dateFilter: TaskDateFilter;
  onDateFilterChange: (value: TaskDateFilter) => void;
}

function getActiveDateKey(dateFilter: TaskDateFilter): string | null {
  if (isSpecificDateFilter(dateFilter)) {
    return dateFilter.dateKey;
  }

  if (dateFilter === 'today') {
    return getTodayDateKey();
  }

  if (dateFilter === 'yesterday') {
    return toDateKey(startOfDayIso(-1));
  }

  return null;
}

function isPresetActive(preset: TaskDateFilter, dateFilter: TaskDateFilter): boolean {
  if (dateFilter === preset) {
    return true;
  }

  const activeDateKey = getActiveDateKey(dateFilter);
  const presetDateKey = getActiveDateKey(preset);

  return activeDateKey !== null && presetDateKey !== null && activeDateKey === presetDateKey;
}

function isDayCellActive(dateKey: string, dateFilter: TaskDateFilter): boolean {
  const activeDateKey = getActiveDateKey(dateFilter);
  return activeDateKey === dateKey;
}

export function TaskDateFilterBar({ tasks, dateFilter, onDateFilterChange }: TaskDateFilterBarProps) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const stripDateKeys = useMemo(
    () => getDateKeysInRange(STRIP_START_OFFSET, STRIP_END_OFFSET),
    [],
  );
  const taskCountByDateKey = useMemo(() => getTaskCountByDateKey(tasks), [tasks]);
  const activeDateKey = getActiveDateKey(dateFilter);

  useEffect(() => {
    if (!activeDateKey) {
      return;
    }

    const index = stripDateKeys.indexOf(activeDateKey);
    if (index >= 0) {
      scrollRef.current?.scrollTo({ x: Math.max(0, index * DAY_CELL_WIDTH - DAY_CELL_WIDTH * 2), animated: true });
    }
  }, [activeDateKey, stripDateKeys]);

  const handleCalendarChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      setPickerDate(selectedDate);
      onDateFilterChange({ type: 'date', dateKey: toDateKey(selectedDate.toISOString()) });
    }
  };

  const openCalendar = () => {
    if (activeDateKey) {
      const [year, month, day] = activeDateKey.split('-').map(Number);
      setPickerDate(new Date(year, month - 1, day, 12, 0, 0, 0));
    } else {
      setPickerDate(new Date());
    }
    setShowPicker(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="smallBold">Date</ThemedText>

      <ThemedView style={styles.filters}>
        {DATE_FILTER_OPTIONS.map((option) => {
          const isActive = isPresetActive(option.value, dateFilter);

          return (
            <Pressable
              key={option.label}
              onPress={() => onDateFilterChange(option.value)}
              style={({ pressed }) => [pressed && styles.pressed]}>
              <ThemedView
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? theme.primary : theme.card,
                    borderColor: isActive ? theme.primary : theme.border,
                  },
                ]}>
                <ThemedText type="small" style={isActive && styles.filterChipTextActive}>
                  {option.label}
                </ThemedText>
              </ThemedView>
            </Pressable>
          );
        })}
      </ThemedView>

      <ThemedView style={styles.stripRow}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stripContent}>
          {stripDateKeys.map((dateKey) => {
            const { weekday, day } = formatDateKeyLabel(dateKey);
            const isActive = isDayCellActive(dateKey, dateFilter);
            const hasTasks = (taskCountByDateKey[dateKey] ?? 0) > 0;

            return (
              <Pressable
                key={dateKey}
                onPress={() => onDateFilterChange({ type: 'date', dateKey })}
                style={({ pressed }) => [pressed && styles.pressed]}>
                <ThemedView
                  style={[
                    styles.dayCell,
                    {
                      backgroundColor: isActive ? theme.primary : theme.card,
                      borderColor: isActive ? theme.primary : theme.border,
                    },
                  ]}>
                  <ThemedText type="small" style={isActive && styles.filterChipTextActive}>
                    {weekday}
                  </ThemedText>
                  <ThemedText type="smallBold" style={isActive && styles.filterChipTextActive}>
                    {day}
                  </ThemedText>
                  {hasTasks && (
                    <ThemedView
                      style={[
                        styles.taskDot,
                        { backgroundColor: isActive ? '#FFFFFF' : theme.primary },
                      ]}
                    />
                  )}
                </ThemedView>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={openCalendar}
          style={({ pressed }) => [pressed && styles.pressed]}
          accessibilityLabel="Pick a date">
          <ThemedView style={[styles.calendarButton, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <ThemedText type="smallBold">📅</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>

      {showPicker && (
        <ThemedView style={styles.pickerContainer}>
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleCalendarChange}
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
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  filterChip: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  stripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  stripContent: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  dayCell: {
    width: DAY_CELL_WIDTH,
    alignItems: 'center',
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingVertical: Spacing.two,
    gap: Spacing.half,
  },
  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: Spacing.half,
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    gap: Spacing.two,
  },
  doneButton: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
