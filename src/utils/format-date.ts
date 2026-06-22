import type { Task, TaskDateFilter } from '@/types/task';

export function startOfDayIso(dayOffset: number): string {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, 12, 0, 0, 0);
  return date.toISOString();
}

export function toDateKey(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateKeyToIso(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0).toISOString();
}

export function dateKeyToDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function getTodayDateKey(): string {
  return toDateKey(new Date().toISOString());
}

export function getDateKeysInRange(startOffset: number, endOffset: number): string[] {
  const keys: string[] = [];
  for (let offset = startOffset; offset <= endOffset; offset += 1) {
    keys.push(toDateKey(startOfDayIso(offset)));
  }
  return keys;
}

export function getTaskCountByDateKey(tasks: Task[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const task of tasks) {
    const key = toDateKey(task.createdAt);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export function formatDateKeyLabel(dateKey: string): { weekday: string; day: string; isToday: boolean } {
  const date = dateKeyToDate(dateKey);
  const dayDifference = getDayDifference(date.toISOString());

  return {
    weekday: dayDifference === 0 ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' }),
    day: String(date.getDate()),
    isToday: dayDifference === 0,
  };
}

export function formatDateKeyLong(dateKey: string): string {
  const date = dateKeyToDate(dateKey);
  const dayDifference = getDayDifference(date.toISOString());

  if (dayDifference === 0) {
    return 'Today';
  }

  if (dayDifference === 1) {
    return 'Yesterday';
  }

  const now = new Date();
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function isToday(isoDate: string): boolean {
  return getDayDifference(isoDate) === 0;
}

export function isYesterday(isoDate: string): boolean {
  return getDayDifference(isoDate) === 1;
}

export function isSpecificDateFilter(
  filter: TaskDateFilter,
): filter is { type: 'date'; dateKey: string } {
  return typeof filter === 'object' && filter.type === 'date';
}

export function matchesDateFilter(isoDate: string, filter: TaskDateFilter): boolean {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'today') {
    return isToday(isoDate);
  }

  if (filter === 'yesterday') {
    return isYesterday(isoDate);
  }

  if (isSpecificDateFilter(filter)) {
    return toDateKey(isoDate) === filter.dateKey;
  }

  return true;
}

function getDayDifference(isoDate: string): number {
  const date = new Date(isoDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86_400_000);
}

export function formatRelativeDate(isoDate: string): string {
  const dayDifference = getDayDifference(isoDate);

  if (dayDifference === 0) {
    return 'Today';
  }

  if (dayDifference === 1) {
    return 'Yesterday';
  }

  const date = new Date(isoDate);
  const now = new Date();

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

function getDateFilterLabel(dateFilter: TaskDateFilter): string | null {
  if (dateFilter === 'today') {
    return 'for today';
  }

  if (dateFilter === 'yesterday') {
    return 'for yesterday';
  }

  if (isSpecificDateFilter(dateFilter)) {
    return `for ${formatDateKeyLong(dateFilter.dateKey)}`;
  }

  return null;
}

export function hasActiveDateFilter(dateFilter: TaskDateFilter): boolean {
  return dateFilter !== 'all';
}

export function formatFilteredTaskSummary(
  count: number,
  statusFilter: 'all' | 'pending' | 'completed',
  searchQuery: string,
  dateFilter: TaskDateFilter = 'all',
): string | null {
  const hasSearch = searchQuery.trim().length > 0;
  const hasStatusFilter = statusFilter !== 'all';
  const hasDateFilter = hasActiveDateFilter(dateFilter);
  const dateLabel = getDateFilterLabel(dateFilter);

  if (!hasSearch && !hasStatusFilter && !hasDateFilter) {
    return null;
  }

  if (hasDateFilter && !hasSearch && !hasStatusFilter) {
    return `Showing ${count} ${pluralize(count, 'task', 'tasks')} ${dateLabel}`;
  }

  if (hasStatusFilter && !hasSearch) {
    if (statusFilter === 'pending') {
      const suffix = dateLabel ? ` ${dateLabel}` : '';
      return `Showing ${count} pending ${pluralize(count, 'task', 'tasks')}${suffix}`;
    }

    if (statusFilter === 'completed') {
      const suffix = dateLabel ? ` ${dateLabel}` : '';
      return `Showing ${count} completed ${pluralize(count, 'task', 'tasks')}${suffix}`;
    }
  }

  if (hasSearch) {
    const suffix = dateLabel ? ` ${dateLabel}` : '';
    return `Showing ${count} matching ${pluralize(count, 'task', 'tasks')}${suffix}`;
  }

  if (hasDateFilter) {
    return `Showing ${count} ${pluralize(count, 'task', 'tasks')} ${dateLabel}`;
  }

  return null;
}

export function formatLastApiSync(isoDate: string | null): string | null {
  if (!isoDate) {
    return null;
  }

  const syncedAt = new Date(isoDate);
  const time = syncedAt.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `Synced from JSONPlaceholder at ${time}`;
}
