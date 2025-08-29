import type { List, Task } from '../types/domain';

export function sortTasks(tasks: Task[]): Task[] {
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

export function getEarliestDue(tasks: Task[]): number {
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