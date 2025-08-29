
import { createContext, useContext, useReducer } from 'react';
import { boardReducer, initialBoardState } from './boardReducer';
import type { List, Task } from '../../types/domain';
import * as Lists from '../../services/lists';
import * as Tasks from '../../services/tasks';
import { useNotification } from '../../context/NotificationContext';
import {BoardCardNotifications, labels}  from '../../types/labels'
type BoardContextValue = {
  lists: List[];
  tasksByList: Record<string, Task[]>;
  loading: boolean;
  error?: string | null;
  fetchLists: () => Promise<void>;
  fetchTasks: (listId: string) => Promise<void>;
  addList: (name: string) => Promise<void>;
  removeList: (listId: string) => Promise<void>;
  addTask: (input: { listId: string; title: string; description?: string; dueDate?: string }) => Promise<void>;
  updateTask: (id: string, patch: Partial<Pick<Task, 'title'|'description'|'dueDate'|'status'|'listId'>>) => Promise<void>;
  removeTask: (id: string, listId: string) => Promise<void>;
  searchTasks: (query: string) => Promise<Task[]>;
};

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState);
  const { addToast } = useNotification();

  async function fetchLists() {
    try {
      dispatch({ type: 'LOAD_START' });
      const lists = await Lists.getLists();
      dispatch({ type: 'LOAD_LISTS_SUCCESS', payload: lists });
    } catch (e: any) {
      dispatch({ type: 'ERROR', payload: e?.message ?? BoardCardNotifications.fetchListsFailed });
      addToast(BoardCardNotifications.fetchListsFailed, 'danger');
    }
  }

  async function fetchTasks(listId: string) {
    try {
      dispatch({ type: 'LOAD_START' });
      const tasks = await Tasks.getTasksByList(listId);
      dispatch({ type: 'LOAD_TASKS_SUCCESS', payload: { listId, tasks } });
    } catch (e: any) {
      dispatch({ type: 'ERROR', payload: e?.message ?? BoardCardNotifications.fetchTasksFailed });
      addToast(BoardCardNotifications.fetchTasksFailed, 'danger');
    }
  }

  async function addList(title: string) {
    const tmpId = `tmp-${Date.now()}`;
    const optimistic: List = { id: tmpId, title };
    dispatch({ type: 'ADD_LIST_OPTIMISTIC', payload: optimistic });

    try {
      const savedList = await Lists.createList(title);
      dispatch({ type: 'REPLACE_LIST', payload: { tmpId, list: savedList } });
      addToast(BoardCardNotifications.addListSuccess, 'success');
    } catch {
      dispatch({ type: 'REMOVE_LIST_OPTIMISTIC', payload: { listId: tmpId } });
      addToast(BoardCardNotifications.addListFailed, 'danger');
    }
  }

  async function removeList(listId: string) {
    const snapshot = state.lists;
    dispatch({ type: 'REMOVE_LIST_OPTIMISTIC', payload: { listId } });
    try {
      await Lists.deleteList(listId);
      addToast(BoardCardNotifications.removeListSuccess, 'success');
    } catch {
      dispatch({ type: 'LOAD_LISTS_SUCCESS', payload: snapshot });
      addToast(BoardCardNotifications.removeListFailed, 'danger');
    }
  }

  async function addTask(input: { listId: string; title: string; description?: string; dueDate?: string }) {
    const tmpId = `tmp-${Date.now()}`;
    const optimistic: Task = {
      id: tmpId,
      listId: input.listId,
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      status: 'ToDo',
    };

    dispatch({ type: 'ADD_TASK_OPTIMISTIC', payload: optimistic });

    try {
      const saved = await Tasks.createTask(input);
      dispatch({ type: 'REPLACE_TASK', payload: { tmpId, task: saved } });
      addToast(BoardCardNotifications.taskCreateSuccess, 'success');
    } catch {
      dispatch({ type: 'REMOVE_TASK_OPTIMISTIC', payload: { id: tmpId, listId: input.listId } });
      addToast(BoardCardNotifications.taskCreateFailed, 'danger');
    }
  }

  async function updateTask(
    id: string,
    patch: Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'status' | 'listId'>>
  ) {
    const oldKey = Object.keys(state.tasksByList).find(k =>
      (state.tasksByList[k] ?? []).some(t => String(t.id) === String(id))
    );
    if (!oldKey) return;

    const prev = state.tasksByList[oldKey].find(t => String(t.id) === String(id))!;
    const optimistic: Task = { ...prev, ...patch };

    if (patch.listId != null && String(patch.listId) !== oldKey) {
      const newKey = String(patch.listId);
      dispatch({ type: 'MOVE_TASK_OPTIMISTIC', payload: { task: optimistic, from: oldKey, to: newKey } });
    } else {
      dispatch({ type: 'UPDATE_TASK_OPTIMISTIC', payload: optimistic });
    }

    try {
      await Tasks.updateTask(id, optimistic);
      addToast(BoardCardNotifications.taskUpdateSuccess, 'success');
    } catch {
      if (patch.listId != null && String(patch.listId) !== oldKey) {
        dispatch({ type: 'MOVE_TASK_OPTIMISTIC', payload: { task: prev, from: String(patch.listId), to: oldKey } });
      } else {
        dispatch({ type: 'UPDATE_TASK_OPTIMISTIC', payload: prev });
      }
      addToast(BoardCardNotifications.taskUpdateFailed, 'danger');
    }
  }

  async function removeTask(id: string, listId: string) {
    const prev = state.tasksByList[listId];
    dispatch({ type: 'REMOVE_TASK_OPTIMISTIC', payload: { id, listId } });
    try {
      await Tasks.deleteTask(id);
      addToast(BoardCardNotifications.taskDeleteSuccess, 'success');
    } catch {
      dispatch({ type: 'LOAD_TASKS_SUCCESS', payload: { listId, tasks: prev } });
      addToast(BoardCardNotifications.taskDeleteFailed, 'danger');
    }
  }

  async function searchTasks(query: string): Promise<Task[]> {
    try {
      return await Tasks.searchTasks(query);
    } catch (e: any) {
      throw new Error(labels.searchFailed);
    }
  }

  const value: BoardContextValue = {
    lists: state.lists,
    tasksByList: state.tasksByList,
    loading: state.loading,
    error: state.error,
    fetchLists,
    fetchTasks,
    addList,
    removeList,
    addTask,
    updateTask,
    removeTask,
    searchTasks
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error(labels.boardContextError);
  return ctx;
};
