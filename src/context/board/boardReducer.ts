import type { List, Task } from '../../types/domain';

export interface BoardState {
  lists: List[];
  tasksByList: Record<string, Task[]>; // cache in memoria
  loading: boolean;
  error?: string | null;
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_LISTS_SUCCESS'; payload: List[] }
  | { type: 'LOAD_TASKS_SUCCESS'; payload: { listId: string; tasks: Task[] } }
  | { type: 'ADD_LIST_OPTIMISTIC'; payload: List }
  | { type: 'REPLACE_LIST'; payload: { tmpId: string; list: List } } 
  | { type: 'REMOVE_LIST_OPTIMISTIC'; payload: { listId: string } }
  | { type: 'ADD_TASK_OPTIMISTIC'; payload: Task }
  | { type: 'UPDATE_TASK_OPTIMISTIC'; payload: Task }
  | { type: 'REMOVE_TASK_OPTIMISTIC'; payload: { id: string; listId: string } }
  | { type: 'REPLACE_TASK'; payload: { tmpId: string; task: Task } }
  | { type: 'MOVE_TASK_OPTIMISTIC'; payload: { task: Task; from: string; to: string } }
  | { type: 'ERROR'; payload: string | null };


export const initialBoardState: BoardState = {
  lists: [],
  tasksByList: {},
  loading: false,
  error: null,
};

export function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_LISTS_SUCCESS':
return {
  ...state,
  loading: false,
  lists: [...action.payload].sort((a, b) => {
    const countA = state.tasksByList[a.id]?.length ?? 0;
    const countB = state.tasksByList[b.id]?.length ?? 0;

    // bigger count first
    return countB - countA;
  }),
};;

    case 'LOAD_TASKS_SUCCESS':
      return {
        ...state,
        loading: false,
        tasksByList: { ...state.tasksByList, [action.payload.listId]: action.payload.tasks },
      };
    case 'ADD_LIST_OPTIMISTIC':
      return { ...state, lists: [action.payload, ...state.lists] };
  case 'REPLACE_LIST': {
    //optimistic list with a tmp- id gets replaced with the real one after backend save
  const { tmpId, list } = action.payload;
  return {
    ...state,
    lists: state.lists.map(l => (l.id === tmpId ? list : l)),
  };
}


    case 'REMOVE_LIST_OPTIMISTIC':
      return {
        ...state,
        lists: state.lists.filter(l => l.id !== action.payload.listId),
        tasksByList: Object.fromEntries(
          Object.entries(state.tasksByList).filter(([k]) => k !== action.payload.listId)
        ),
      };
    case 'ADD_TASK_OPTIMISTIC': {
      const listId = action.payload.listId;
      const arr = state.tasksByList[listId] ?? [];
      return {
        ...state,
        tasksByList: { ...state.tasksByList, [listId]: [action.payload, ...arr] },
      };
    }
    case 'UPDATE_TASK_OPTIMISTIC': {
      const listId = action.payload.listId;
      const arr = state.tasksByList[listId] ?? [];
      return {
        ...state,
        tasksByList: {
          ...state.tasksByList,
          [listId]: arr.map(t => (t.id === action.payload.id ? action.payload : t)),
        },
      };
    }
    case 'REMOVE_TASK_OPTIMISTIC': {
      const arr = state.tasksByList[action.payload.listId] ?? [];
      return {
        ...state,
        tasksByList: {
          ...state.tasksByList,
          [action.payload.listId]: arr.filter(t => t.id !== action.payload.id),
        },
      };
    }
    case 'REPLACE_TASK': {
  const { tmpId, task } = action.payload;
  const listId = task.listId;
  const arr = state.tasksByList[listId] ?? [];
  return {
    ...state,
    tasksByList: {
      ...state.tasksByList,
      [listId]: arr.map(t => (t.id === tmpId ? task : t)),
    },
  };
}
case "MOVE_TASK_OPTIMISTIC": {
  const { task, from, to } = action.payload;
  return {
    ...state,
    tasksByList: {
      ...state.tasksByList,
      [from]: state.tasksByList[from].filter((t) => t.id !== task.id),
      [to]: [...(state.tasksByList[to] ?? []), task],
    },
  };
}

    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
