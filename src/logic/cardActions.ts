import { store } from "../data/store.js";
import { isStatus } from "../models/task.js";
import { board, cardFrom } from "../utils/dom.js";
import { askToDelete } from "./deleteTask.js";
import { openTaskDialog } from "./taskForm.js";

// Handles the buttons on cards (edit, delete, move).
function taskFrom(event: Event) {
  const id = cardFrom(event)?.dataset.id;
  return id ? store.getById(id) : undefined;
}

function onClick(event: MouseEvent): void {
  const button = (event.target as Element).closest<HTMLButtonElement>("button[data-action]");
  const task = button ? taskFrom(event) : undefined;
  if (!button || !task) return;

  const { action, status } = button.dataset;
  if (action === "edit") openTaskDialog(task);
  else if (action === "delete") askToDelete(task);
  else if (action === "move" && isStatus(status)) store.move(task.id, status);
}

// Double-click a card to edit it.
function onDoubleClick(event: MouseEvent): void {
  if ((event.target as Element).closest("button")) return;
  const task = taskFrom(event);
  if (task) openTaskDialog(task);
}

export function initCardActions(): void {
  board.addEventListener("click", onClick);
  board.addEventListener("dblclick", onDoubleClick);
}
