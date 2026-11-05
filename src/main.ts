import { store } from "./data/store.js";
import { initCardActions } from "./logic/cardActions.js";
import { initDeleteTask } from "./logic/deleteTask.js";
import { initDragDrop } from "./logic/dragDrop.js";
import { initTaskForm } from "./logic/taskForm.js";
import { renderBoard } from "./ui/render.js";
import { $ } from "./utils/dom.js";

initTaskForm();
initDeleteTask();
initCardActions();
initDragDrop();
store.subscribe(renderBoard);

$("#year").textContent = String(new Date().getFullYear());
