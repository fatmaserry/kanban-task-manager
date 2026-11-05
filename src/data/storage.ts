import { isPriority, isStatus, type Task } from "../models/task.js";

const STORAGE_KEY = "kanban-ts:tasks";

// Checks a value parsed from JSON really has the shape of a Task.
function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    typeof t.description === "string" &&
    typeof t.dueDate === "string" &&
    typeof t.createdAt === "number" &&
    typeof t.updatedAt === "number" &&
    isPriority(t.priority) &&
    isStatus(t.status)
  );
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isTask) : [];
  } catch {
    // Corrupted data or storage blocked: start with an empty board.
    return [];
  }
}

export function saveTasks(tasks: readonly Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("Could not save tasks to localStorage", err);
  }
}
