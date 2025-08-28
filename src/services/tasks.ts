import { api } from './api';
import type { Task } from '../types/domain';

export const getTasksByList = async (listId: string): Promise<Task[]> => {
  const { data } = await api.get<Task[]>('/tasks', { params: { listId } });
  return data;
};

export const createTask = async (input: {
  listId: string;
  title: string;
  description?: string;
  dueDate?: string;
}): Promise<Task> => {
  const { data } = await api.post<Task>('/tasks', input);
  return data;
};

export const updateTask = async (
  id: string,
  patch: Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'status'|'listId'>>
): Promise<Task> => {
  const { data } = await api.put<Task>(`/tasks/${id}`, patch);
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// ✅ fixed search with axios
export const searchTasks = async (query: string): Promise<Task[]> => {
  const { data } = await api.get<Task[]>('/tasks', { params: { search: query } });
  return data;
};
