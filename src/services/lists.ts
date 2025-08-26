import { api } from './api';
import type { List } from '../types/domain';

export const getLists = async (): Promise<List[]> => {
  const { data } = await api.get<List[]>('/lists');
  return data;
};

export const createList = async (title: string): Promise<List> => {
  const { data } = await api.post<List>('/lists', { title });
  return data;
};

export const deleteList = async (id: string): Promise<void> => {
  await api.delete(`/lists/${id}`);
};
