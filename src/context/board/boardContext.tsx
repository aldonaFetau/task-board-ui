// import { createContext, useContext, useReducer } from 'react';
// import { boardReducer, initialBoardState } from './boardReducer';
// import type{ List, Task } from '../../types/domain';
// import * as Lists from '../../services/lists';
// import * as Tasks from '../../services/tasks';
// import  type { TaskStatus} from '../../types/enums';
// type BoardContextValue = {
//   lists: List[];
//   tasksByList: Record<string, Task[]>;
//   loading: boolean;
//   error?: string | null;
//   fetchLists: () => Promise<void>;
//   fetchTasks: (listId: string) => Promise<void>;
//   addList: (name: string) => Promise<void>;
//   removeList: (listId: string) => Promise<void>;
//   addTask: (input: { listId: string; title: string; description?: string; dueDate?: string }) => Promise<void>;
//   updateTask: (id: string, patch: Partial<Pick<Task, 'title'|'description'|'dueDate'|'status'|'listId'>>) => Promise<void>;
//   removeTask: (id: string, listId: string) => Promise<void>;
//   changeTaskStatus: (task: Task, status: TaskStatus) => Promise<void>;
// };

// const BoardContext = createContext<BoardContextValue | null>(null);

// export function BoardProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(boardReducer, initialBoardState);

//   async function fetchLists() {
//     try {
//       dispatch({ type: 'LOAD_START' });
//       const lists = await Lists.getLists();
//       dispatch({ type: 'LOAD_LISTS_SUCCESS', payload: lists });
//     } catch (e: any) {
//       dispatch({ type: 'ERROR', payload: e?.message ?? 'Errore nel caricamento liste' });
//     }
//   }

//   async function fetchTasks(listId: string) {
//     try {
//       dispatch({ type: 'LOAD_START' });
//       const tasks = await Tasks.getTasksByList(listId);
//       dispatch({ type: 'LOAD_TASKS_SUCCESS', payload: { listId, tasks } });
//     } catch (e: any) {
//       dispatch({ type: 'ERROR', payload: e?.message ?? 'Errore nel caricamento task' });
//     }
//   }

//   async function addList(title: string) {
//     const optimistic: List = { id: `tmp-${Date.now()}`, title };
//     dispatch({ type: 'ADD_LIST_OPTIMISTIC', payload: optimistic });
//     try {
     
//       // ricarico per coerenza (o sostituisco tmp-id con reale)
//       await fetchLists();
//     } catch {
//       // rollback semplice
//       dispatch({ type: 'REMOVE_LIST_OPTIMISTIC', payload: { listId: optimistic.id } });
//       throw new Error('Creazione lista fallita');
//     }
//   }

//   async function removeList(listId: string) {
//     const snapshot = state.lists;
//     dispatch({ type: 'REMOVE_LIST_OPTIMISTIC', payload: { listId } });
//     try {
//       await Lists.deleteList(listId);
//     } catch {
//       // rollback
//       dispatch({ type: 'LOAD_LISTS_SUCCESS', payload: snapshot });
//       throw new Error('Eliminazione lista fallita');
//     }
//   }

//   async function addTask(input: { listId: string; title: string; description?: string; dueDate?: string }) {
//     const optimistic: Task = {
//       id: `tmp-${Date.now()}`,
//       listId: input.listId, title: input.title,
//       description: input.description, dueDate: input.dueDate, status: 'ToDo',
//     };
//     dispatch({ type: 'ADD_TASK_OPTIMISTIC', payload: optimistic });
//     try {
  
    
//       await fetchTasks(input.listId);
//     } catch {
//       dispatch({ type: 'REMOVE_TASK_OPTIMISTIC', payload: { id: optimistic.id, listId: input.listId } });
//       throw new Error('Creazione task fallita');
//     }
//   }

//   async function updateTask(id: string, patch: Partial<Pick<Task, 'title'|'description'|'dueDate'|'status'>>) {
//     // Find listid from cache
//     const listId = Object.keys(state.tasksByList).find(k => (state.tasksByList[k] ?? []).some(t => t.id === id));
//     if (!listId) return;
//     const prev = state.tasksByList[listId].find(t => t.id === id)!;
//     const optimistic = { ...prev, ...patch };
//     dispatch({ type: 'UPDATE_TASK_OPTIMISTIC', payload: optimistic });
//     try {
//       await Tasks.updateTask(id, patch);
//     } catch {
//       dispatch({ type: 'UPDATE_TASK_OPTIMISTIC', payload: prev }); // rollback
//       throw new Error('Aggiornamento task fallito');
//     }
//   }

//   async function removeTask(id: string, listId: string) {
//     const prev = state.tasksByList[listId];
//     dispatch({ type: 'REMOVE_TASK_OPTIMISTIC', payload: { id, listId } });
//     try {
//       await Tasks.deleteTask(id);
//     } catch {
//       // rollback
//       dispatch({ type: 'LOAD_TASKS_SUCCESS', payload: { listId, tasks: prev } });
//       throw new Error('Eliminazione task fallita');
//     }
//   }

//   async function changeTaskStatus(task: Task, status: Task['status']) {
//     await updateTask(task.id, { status });
//   }

//   const value: BoardContextValue = {
//     lists: state.lists,
//     tasksByList: state.tasksByList,
//     loading: state.loading,
//     error: state.error,
//     fetchLists, fetchTasks, addList, removeList, addTask, updateTask, removeTask, changeTaskStatus
//   };

//   return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
// }

// export const useBoard = () => {
//   const ctx = useContext(BoardContext);
//   if (!ctx) throw new Error('useBoard must be used within BoardProvider');
//   return ctx;
// };
import { createContext, useContext, useReducer } from 'react';
import { boardReducer, initialBoardState } from './boardReducer';
import type { List, Task } from '../../types/domain';
import * as Lists from '../../services/lists';
import * as Tasks from '../../services/tasks';
import type { TaskStatus } from '../../types/enums';

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
  changeTaskStatus: (task: Task, status: TaskStatus) => Promise<void>;
};

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState);

  async function fetchLists() {
    try {
      dispatch({ type: 'LOAD_START' });
      const lists = await Lists.getLists();
      dispatch({ type: 'LOAD_LISTS_SUCCESS', payload: lists });
    } catch (e: any) {
      dispatch({ type: 'ERROR', payload: e?.message ?? 'Errore nel caricamento liste' });
    }
  }

  async function fetchTasks(listId: string) {
    try {
      dispatch({ type: 'LOAD_START' });
      const tasks = await Tasks.getTasksByList(listId);
      dispatch({ type: 'LOAD_TASKS_SUCCESS', payload: { listId, tasks } });
    } catch (e: any) {
      dispatch({ type: 'ERROR', payload: e?.message ?? 'Errore nel caricamento task' });
    }
  }


async function addList(title: string) {
  const tmpId = `tmp-${Date.now()}`;
  const optimistic: List = { id: tmpId, title };
  dispatch({ type: 'ADD_LIST_OPTIMISTIC', payload: optimistic });

  try {
    const saved = await Lists.createList(title);
    // Replace tmp with saved (real id)
    dispatch({ type: 'REPLACE_LIST', payload: { tmpId, list: saved } });
  } catch {
    dispatch({ type: 'REMOVE_LIST_OPTIMISTIC', payload: { listId: tmpId } });
    throw new Error('Creazione lista fallita');
  }
}

  async function removeList(listId: string) {
    const snapshot = state.lists;
    dispatch({ type: 'REMOVE_LIST_OPTIMISTIC', payload: { listId } });
    try {
      await Lists.deleteList(listId);
    } catch {
      dispatch({ type: 'LOAD_LISTS_SUCCESS', payload: snapshot });
      throw new Error('Eliminazione lista fallita');
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
      dispatch({ type: 'REPLACE_TASK', payload: { tmpId, task: saved } }); //replace tmp with real
    } catch {
      dispatch({ type: 'REMOVE_TASK_OPTIMISTIC', payload: { id: tmpId, listId: input.listId } });
      throw new Error('Creazione task fallita');
    }
  }

  async function updateTask(id: string, patch: Partial<Pick<Task, 'title'|'description'|'dueDate'|'status'>>) {
    const listId = Object.keys(state.tasksByList).find(k => (state.tasksByList[k] ?? []).some(t => t.id === id));
    if (!listId) return;
    const prev = state.tasksByList[listId].find(t => t.id === id)!;
    const optimistic = { ...prev, ...patch };
    dispatch({ type: 'UPDATE_TASK_OPTIMISTIC', payload: optimistic });
    try {
      await Tasks.updateTask(id, patch);
    } catch {
      dispatch({ type: 'UPDATE_TASK_OPTIMISTIC', payload: prev }); // rollback
      throw new Error('Aggiornamento task fallito');
    }
  }

  async function removeTask(id: string, listId: string) {
    const prev = state.tasksByList[listId];
    dispatch({ type: 'REMOVE_TASK_OPTIMISTIC', payload: { id, listId } });
    try {
      await Tasks.deleteTask(id);
    } catch {
      dispatch({ type: 'LOAD_TASKS_SUCCESS', payload: { listId, tasks: prev } });
      throw new Error('Eliminazione task fallita');
    }
  }

  async function changeTaskStatus(task: Task, status: Task['status']) {
    await updateTask(task.id, { status });
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
    changeTaskStatus,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
};
