import { el } from "./dom.js";

let current: HTMLElement | null = null;

// A short success message in the top-right corner.
export function showToast(message: string): void {
  current?.remove();
  const toast = el("div", "toast", message);
  toast.setAttribute("role", "status");
  document.body.append(toast);
  current = toast;
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
