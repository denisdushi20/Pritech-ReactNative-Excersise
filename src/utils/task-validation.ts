import type { CreateTaskInput, TaskValidationErrors } from '@/types/task';

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

export function validateCreateTaskInput(input: CreateTaskInput): TaskValidationErrors {
  const errors: TaskValidationErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

export function hasValidationErrors(errors: TaskValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
