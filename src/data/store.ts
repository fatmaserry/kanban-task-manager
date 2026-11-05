import { loadTasks, saveTasks } from "./storage.js";
import type { Status, Task, TaskInput } from "../models/task.js";

type Listener = (tasks: readonly Task[]) => void;
type TaskChanges = Partial<TaskInput> & { status?: Status };

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function sameOrder(a: readonly Task[], b: readonly Task[]): boolean {
  return a.length === b.length && a.every((t, i) => t.id === b[i]?.id && t.status === b[i]?.status);
}

// Holds the tasks and the CRUD operations. Every change is saved to localStorage.
export class TaskStore {
  private tasks: Task[] = loadTasks();
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.tasks);
    return () => this.listeners.delete(listener);
  }

  getById(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  create(input: TaskInput, status: Status = "todo"): void {
    const now = Date.now();
    this.commit([...this.tasks, { ...input, id: createId(), status, createdAt: now, updatedAt: now }]);
  }

  // Edits a task. If its status changes, it goes to the end of the new column.
  update(id: string, changes: TaskChanges): void {
    const task = this.getById(id);
    if (!task) return;
    const updated: Task = { ...task, ...changes, updatedAt: Date.now() };
    if (updated.status === task.status) {
      this.commit(this.tasks.map((t) => (t.id === id ? updated : t)));
    } else {
      this.commit([...this.tasks.filter((t) => t.id !== id), updated]);
    }
  }

  // Moves a task to a column, placed before another task or at the end.
  move(id: string, status: Status, beforeId?: string): void {
    const task = this.getById(id);
    if (!task || id === beforeId) return;

    const next = this.tasks.filter((t) => t.id !== id);
    const index = beforeId ? next.findIndex((t) => t.id === beforeId) : -1;
    const moved: Task = { ...task, status };
    if (index === -1) next.push(moved);
    else next.splice(index, 0, moved);

    if (sameOrder(next, this.tasks)) return;
    moved.updatedAt = Date.now();
    this.commit(next);
  }

  remove(id: string): void {
    this.commit(this.tasks.filter((t) => t.id !== id));
  }

  private commit(next: Task[]): void {
    this.tasks = next;
    saveTasks(next);
    this.listeners.forEach((fn) => fn(next));
  }
}

// The one store shared by the whole app.
export const store = new TaskStore();
