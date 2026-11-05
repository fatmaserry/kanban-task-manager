import { store } from "../data/store.js";
import { MAX_DESCRIPTION, MAX_TITLE, MIN_TITLE, isPriority, type Task, type TaskInput } from "../models/task.js";
import { $, closeOnBackdrop } from "../utils/dom.js";
import { showToast } from "../utils/toast.js";

// Create and edit tasks with the same dialog.
const taskDialog = $<HTMLDialogElement>("#task-dialog");
const taskForm = $<HTMLFormElement>("#task-form");
const dialogTitle = $<HTMLElement>("#dialog-title");
const submitIcon = $<HTMLElement>("#submit-icon");
const submitText = $<HTMLElement>("#submit-text");
const titleInput = $<HTMLInputElement>("#task-title");
const titleError = $<HTMLElement>("#title-error");
const priorityInput = $<HTMLSelectElement>("#task-priority");
const dueInput = $<HTMLInputElement>("#task-due");
const descInput = $<HTMLTextAreaElement>("#task-desc");
const descCounter = $<HTMLElement>("#desc-counter");

let editingId: string | null = null;

function updateCounter(): void {
  descCounter.textContent = `${descInput.value.length}/${MAX_DESCRIPTION}`;
}

function setTitleError(message: string): void {
  titleError.textContent = message;
  titleError.hidden = !message;
  titleInput.classList.toggle("is-invalid", !!message);
}

function titleProblem(title: string): string {
  if (!title) return "Title is required.";
  if (title.length < MIN_TITLE) return `Title must be at least ${MIN_TITLE} characters.`;
  if (title.length > MAX_TITLE) return `Title must be at most ${MAX_TITLE} characters.`;
  return "";
}

export function openTaskDialog(task?: Task): void {
  editingId = task?.id ?? null;
  setTitleError("");

  dialogTitle.textContent = task ? "Edit Task" : "Create New Task";
  submitText.textContent = task ? "Save Changes" : "Add Task";
  submitIcon.className = task ? "fa-solid fa-floppy-disk" : "fa-solid fa-plus";
  titleInput.value = task?.title ?? "";
  priorityInput.value = task?.priority ?? "medium";
  dueInput.value = task?.dueDate ?? "";
  descInput.value = task?.description ?? "";
  updateCounter();

  taskDialog.showModal();
  titleInput.focus();
}

function readForm(): TaskInput | null {
  const title = titleInput.value.trim();
  const problem = titleProblem(title);
  if (problem) {
    setTitleError(problem);
    titleInput.focus();
    return null;
  }
  return {
    title,
    priority: isPriority(priorityInput.value) ? priorityInput.value : "medium",
    dueDate: dueInput.value,
    description: descInput.value.trim().slice(0, MAX_DESCRIPTION),
  };
}

function saveTask(event: SubmitEvent): void {
  event.preventDefault();
  const input = readForm();
  if (!input) return;
  if (editingId) {
    store.update(editingId, input);
    showToast("Task updated successfully!");
  } else {
    store.create(input);
    showToast("Task added successfully!");
  }
  taskDialog.close();
}

export function initTaskForm(): void {
  $("#add-task-btn").addEventListener("click", () => openTaskDialog());
  $("#cancel-btn").addEventListener("click", () => taskDialog.close());
  $("#close-dialog-btn").addEventListener("click", () => taskDialog.close());
  taskForm.addEventListener("submit", saveTask);
  descInput.addEventListener("input", updateCounter);
  titleInput.addEventListener("input", () => {
    if (!titleError.hidden && !titleProblem(titleInput.value.trim())) setTitleError("");
  });
  closeOnBackdrop(taskDialog);
}
