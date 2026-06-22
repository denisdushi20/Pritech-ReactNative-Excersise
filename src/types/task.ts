/** Task completion status per PDF spec */
export type TaskStatus = 'pending' | 'completed';

/** Where a task originated */
export type TaskSource = 'api' | 'mock' | 'local';

/** Filter option for task list bonus feature */
export type TaskFilterStatus = 'all' | TaskStatus;

/** Filter tasks by created date */
export type TaskDateFilter =
  | 'all'
  | 'today'
  | 'yesterday'
  | { type: 'date'; dateKey: string };

/** Core task model used across list, details, and storage */
export interface Task {
  /** Unique identifier (UUID for user-created; number-as-string from API) */
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  /** ISO 8601 date string — when the task was created */
  createdAt: string;
  /** api = JSONPlaceholder sync, mock = seeded demo tasks, local = user-created */
  source?: TaskSource;
}

/** Payload when creating a new task (id + createdAt set by app logic) */
export interface CreateTaskInput {
  title: string;
  description: string;
  /** Optional calendar day; normalized to local noon ISO when saving */
  dateKey?: string;
}

/** Payload when editing an existing task */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/** Form-level validation errors keyed by field */
export interface TaskValidationErrors {
  title?: string;
  description?: string;
}

/** Shape returned by JSONPlaceholder /todos — mapping layer only */
export interface ApiTodo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
