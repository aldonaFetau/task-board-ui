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

export const updateTask = async (id: string, task: Task): Promise<Task> => {
  const { data } = await api.put<Task>(`/tasks/${id}`, task);
  return data;
};
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const searchTasks = async (query: string): Promise<Task[]> => {
  const { data } = await api.get<Task[]>('/tasks', { params: { search: query } });
  return data;
};
