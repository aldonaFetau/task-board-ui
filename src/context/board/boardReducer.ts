import type { List, Task } from '../../types/domain';

export interface BoardState {
  lists: List[];
  tasksByList: Record<string, Task[]>;
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
// function sortListsByPendingTasks(lists: List[], tasksByList: Record<string, Task[]>) {
//   return [...lists].sort((a, b) => {
//     const countA = (tasksByList[a.id] ?? []).filter(
//       t => t.status === "ToDo" || t.status === "InProgress"
//     ).length;
//     const countB = (tasksByList[b.id] ?? []).filter(
//       t => t.status === "ToDo" || t.status === "InProgress"
//     ).length;
//     return countB - countA; // highest count first
//   });
// }
function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // 1. Incomplete before completed
    if (a.status !== "Completed" && b.status === "Completed") return -1;
    if (a.status === "Completed" && b.status !== "Completed") return 1;

    // 2. Earlier due date first
    const aTime = a.dueDate ? Date.parse(a.dueDate) : Infinity;
    const bTime = b.dueDate ? Date.parse(b.dueDate) : Infinity;
    return aTime - bTime;
  });
}

function getEarliestDue(tasks: Task[]): number {
  // consider only active tasks
  const active = tasks.filter(
    t => t.status !== 'Completed' && t.dueDate && t.dueDate.trim() !== ''
  );

  if (active.length === 0) return Infinity; // push lists with no active tasks to the end

  const times = active
    .map(t => Date.parse(t.dueDate as string))
    .filter((n): n is number => Number.isFinite(n));

  return times.length ? Math.min(...times) : Infinity;
}

export function sortListsByUrgency(
  lists: List[],
  tasksByList: Record<string, Task[]>
): List[] {
  return [...lists].sort((a, b) => {
    const aEarliest = getEarliestDue(tasksByList[String(a.id)] ?? []);
    const bEarliest = getEarliestDue(tasksByList[String(b.id)] ?? []);
    return aEarliest - bEarliest; // smaller timestamp = more urgent (earlier)
  });
}



export function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    
    case 'LOAD_LISTS_SUCCESS': {
      const sorted = sortListsByUrgency(action.payload, state.tasksByList);
      return { ...state, loading: false, lists: sorted };
    }

    case 'LOAD_TASKS_SUCCESS': {
    const { listId, tasks } = action.payload;
    const nextTasksByList = { 
      ...state.tasksByList, 
      [String(listId)]: sortTasks(tasks)   
    };
    const sorted = sortListsByUrgency(state.lists, nextTasksByList);
    return { ...state, loading: false, tasksByList: nextTasksByList, lists: sorted };
     }
  
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
    //   case 'ADD_TASK_OPTIMISTIC': {
    //         const listId = action.payload.listId;
    //         const arr = state.tasksByList[listId] ?? [];
    //         return {
    //           ...state,
    //           tasksByList: { ...state.tasksByList, [listId]: [action.payload, ...arr] },
              
    //         };
    //       }
      case 'ADD_TASK_OPTIMISTIC': {
        const listId = String(action.payload.listId);
        const arr = state.tasksByList[listId] ?? [];
        const nextTBL = { ...state.tasksByList, [listId]: [action.payload, ...arr] };
        const sorted = sortListsByUrgency(state.lists, nextTBL);
        return { ...state, tasksByList: nextTBL, lists: sorted };
    }

    // case 'UPDATE_TASK_OPTIMISTIC': {
    //   const listId = action.payload.listId;
    //   const arr = state.tasksByList[listId] ?? [];
    //   return {
    //     ...state,
    //     tasksByList: {
    //       ...state.tasksByList,
    //       [listId]: arr.map(t => (t.id === action.payload.id ? action.payload : t)),
    //     },
    //   };
    // }

    case 'UPDATE_TASK_OPTIMISTIC': {
      const listId = String(action.payload.listId);
      const arr = state.tasksByList[listId] ?? [];
      const nextTBL = {
        ...state.tasksByList,
        [listId]: arr.map(t => (t.id === action.payload.id ? action.payload : t)),
      };
      const sorted = sortListsByUrgency(state.lists, nextTBL);
      return { ...state, tasksByList: nextTBL, lists: sorted };
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


    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
