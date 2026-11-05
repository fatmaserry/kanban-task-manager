import { isStatus } from "../models/task.js";
import { $, board, cardFrom } from "../utils/dom.js";
import { store } from "../data/store.js";

// Drag cards between columns or reorder them inside a column.
let dragged: HTMLElement | null = null;
let targetColumn: HTMLElement | null = null;

function setTargetColumn(column: HTMLElement | null): void {
  if (column === targetColumn) return;
  targetColumn?.classList.remove("drop-target");
  column?.classList.add("drop-target");
  targetColumn = column;
}

// The first card below the pointer, so the dropped card goes before it.
function cardBelowPointer(
  list: HTMLElement,
  y: number,
): HTMLElement | undefined {
  return [...list.querySelectorAll<HTMLElement>(".card:not(.dragging)")].find(
    (card) => {
      const box = card.getBoundingClientRect();
      return y < box.top + box.height / 2;
    },
  );
}

function onDragStart(event: DragEvent): void {
  dragged = cardFrom(event);
  if (!dragged?.dataset.id) return;
  dragged.classList.add("dragging");
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", dragged.dataset.id);
    event.dataTransfer.effectAllowed = "move";
  }
}

function onDragOver(event: DragEvent): void {
  if (!dragged) return;
  const column = (event.target as Element).closest<HTMLElement>(".column");
  if (column) event.preventDefault();
  setTargetColumn(column);
}

function onDrop(event: DragEvent): void {
  const id = dragged?.dataset.id;
  const status = targetColumn?.dataset.status;
  if (!id || !targetColumn || !isStatus(status)) return;
  event.preventDefault();
  const before = cardBelowPointer($(".card-list", targetColumn), event.clientY);
  // Reset first: the board redraws on move, so dragend may never reach it.
  onDragEnd();
  store.move(id, status, before?.dataset.id);
}

function onDragEnd(): void {
  dragged?.classList.remove("dragging");
  dragged = null;
  setTargetColumn(null);
}

export function initDragDrop(): void {
  board.addEventListener("dragstart", onDragStart);
  board.addEventListener("dragover", onDragOver);
  board.addEventListener("drop", onDrop);
  board.addEventListener("dragend", onDragEnd);
}
