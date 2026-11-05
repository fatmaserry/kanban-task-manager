import type { Status } from "../models/task.js";

// Font Awesome class names.
export const icons = {
  edit: "fa-solid fa-pen",
  trash: "fa-solid fa-trash-can",
  calendar: "fa-regular fa-calendar",
  clock: "fa-regular fa-clock",
  warning: "fa-solid fa-triangle-exclamation",
  check: "fa-solid fa-check",
  empty: "fa-regular fa-folder-open",
} as const;

export const columnIcons: Record<Status, string> = {
  todo: "fa-solid fa-clipboard-list",
  "in-progress": "fa-solid fa-spinner",
  done: "fa-solid fa-circle-check",
};

// The button that moves a task to each status.
export const moveButtons: Record<Status, { label: string; icon: string }> = {
  todo: { label: "To Do", icon: "fa-solid fa-arrow-rotate-left" },
  "in-progress": { label: "Start", icon: "fa-solid fa-play" },
  done: { label: "Complete", icon: "fa-solid fa-check" },
};
