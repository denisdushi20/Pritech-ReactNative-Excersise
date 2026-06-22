export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDifference = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000,
  );

  if (dayDifference === 0) {
    return 'Today';
  }

  if (dayDifference === 1) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function formatFilteredTaskSummary(
  count: number,
  statusFilter: 'all' | 'pending' | 'completed',
  searchQuery: string,
): string | null {
  const hasSearch = searchQuery.trim().length > 0;
  const hasStatusFilter = statusFilter !== 'all';

  if (!hasSearch && !hasStatusFilter) {
    return null;
  }

  if (hasStatusFilter && !hasSearch) {
    if (statusFilter === 'pending') {
      return `Showing ${count} pending ${pluralize(count, 'task', 'tasks')}`;
    }

    if (statusFilter === 'completed') {
      return `Showing ${count} completed ${pluralize(count, 'task', 'tasks')}`;
    }
  }

  if (hasSearch) {
    return `Showing ${count} matching ${pluralize(count, 'task', 'tasks')}`;
  }

  return null;
}
