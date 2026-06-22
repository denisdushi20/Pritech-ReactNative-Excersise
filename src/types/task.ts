/** Task completion status per PDF spec */
export type TaskStatus = 'pending' | 'completed';

/** Filter option for task list bonus feature */
export type TaskFilterStatus = 'all' | TaskStatus;

/** Core task model used across list, details, and storage */
export interface Task {
  /** Unique identifier (UUID for user-created; number-as-string from API) */
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  /** ISO 8601 date string — when the task was created */
  createdAt: string;
}

/** Payload when creating a new task (id + createdAt set by app logic) */
export interface CreateTaskInput {
  title: string;
  description: string;
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
