import { store } from "../data/store.js";
import type { Task } from "../models/task.js";
import { $, closeOnBackdrop } from "../utils/dom.js";
import { showToast } from "../utils/toast.js";

// Ask before deleting a task.
const confirmDialog = $<HTMLDialogElement>("#confirm-dialog");
const confirmText = $<HTMLElement>("#confirm-text");

let pendingId: string | null = null;

export function askToDelete(task: Task): void {
  pendingId = task.id;
  confirmText.textContent = `"${task.title}" will be permanently deleted.`;
  confirmDialog.showModal();
}

export function initDeleteTask(): void {
  $("#confirm-yes").addEventListener("click", () => {
    if (pendingId) {
      store.remove(pendingId);
      showToast("Task deleted.");
    }
    confirmDialog.close();
  });
  $("#confirm-no").addEventListener("click", () => confirmDialog.close());
  confirmDialog.addEventListener("close", () => {
    pendingId = null;
  });
  closeOnBackdrop(confirmDialog);
}
