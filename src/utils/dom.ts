// Small helpers for finding and creating elements.
export function $<T extends HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

export const board = $<HTMLElement>("#board");

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = "",
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// A Font Awesome icon.
export function icon(className: string): HTMLElement {
  const i = el("i", className);
  i.setAttribute("aria-hidden", "true");
  return i;
}

export type Action = "edit" | "delete" | "move";

export function actionButton(action: Action, className: string, label: string): HTMLButtonElement {
  const btn = el("button", className);
  btn.type = "button";
  btn.title = label;
  btn.setAttribute("aria-label", label);
  btn.dataset.action = action;
  return btn;
}

// The card element an event happened inside, if any.
export function cardFrom(event: Event): HTMLElement | null {
  return (event.target as Element).closest<HTMLElement>(".card");
}

// Close a dialog when its backdrop is clicked.
export function closeOnBackdrop(dialog: HTMLDialogElement): void {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
