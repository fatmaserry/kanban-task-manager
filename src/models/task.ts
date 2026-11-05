export const STATUSES = ["todo", "in-progress", "done"] as const;
export type Status = (typeof STATUSES)[number];

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  // ISO date (yyyy-mm-dd) or empty string when no due date is set.
  dueDate: string;
  status: Status;
  createdAt: number;
  updatedAt: number;
}

// Fields the user can fill in through the form.
export type TaskInput = Pick<Task, "title" | "description" | "priority" | "dueDate">;

export const COLUMNS: readonly { status: Status; title: string }[] = [
  { status: "todo", title: "To Do" },
  { status: "in-progress", title: "In Progress" },
  { status: "done", title: "Completed" },
];

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High Priority",
};

export const MIN_TITLE = 3;
export const MAX_TITLE = 100;
export const MAX_DESCRIPTION = 500;
export const DUE_SOON_DAYS = 2;

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

export function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && (PRIORITIES as readonly string[]).includes(value);
}
