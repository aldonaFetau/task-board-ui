import type { TaskStatus } from './enums';

// Map status codes to human-readable labels
export const statusLabel: Record<TaskStatus, string> = {
  ToDo: 'Da fare',
  InProgress: 'In corso',
  Completed: 'Completato',
};