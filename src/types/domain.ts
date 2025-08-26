
import  type { TaskStatus} from './enums';


export interface List {
  id: string;
  title: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  listId: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  status: TaskStatus;
  createdAt?: string;

}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface ApiError {
  message: string;
  details?: unknown;
}
