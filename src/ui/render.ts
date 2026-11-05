import { COLUMNS, PRIORITY_LABEL, STATUSES, type Status, type Task } from "../models/task.js";
import { formatDate, isDueSoon, timeAgo, todayISO } from "../utils/date.js";
import { actionButton, board, el, icon } from "../utils/dom.js";
import { columnIcons, icons, moveButtons } from "./icons.js";

function countLabel(n: number): string {
  return `${n} ${n === 1 ? "task" : "tasks"}`;
}

function tag(className: string, text: string, iconClass?: string): HTMLElement {
  const span = el("span", `tag ${className}`);
  span.append(iconClass ? icon(iconClass) : el("span", "dot"), text);
  return span;
}

function meta(iconClass: string, text: string, className = ""): HTMLElement {
  const item = el("span", `meta-item ${className}`);
  item.append(icon(iconClass), el("span", "", text));
  return item;
}

function renderCard(task: Task, number: number, today: string): HTMLElement {
  const done = task.status === "done";
  const overdue = !done && !!task.dueDate && task.dueDate < today;
  const dueSoon = !done && !overdue && !!task.dueDate && isDueSoon(task.dueDate, today);

  const card = el("article", "card");
  card.classList.toggle("is-overdue", overdue);
  card.classList.toggle("is-done", done);
  card.draggable = true;
  card.dataset.id = task.id;

  // Top bar: status dot, number, edit / delete
  const id = el("div", "card-id");
  id.append(el("span", `status-dot status-${task.status}`), el("span", "", `#${String(number).padStart(3, "0")}`));
  const edit = actionButton("edit", "tool-btn", "Edit task");
  edit.append(icon(icons.edit));
  const del = actionButton("delete", "tool-btn tool-delete", "Delete task");
  del.append(icon(icons.trash));
  const tools = el("div", "card-tools");
  tools.append(edit, del);
  const top = el("div", "card-top");
  top.append(id, tools);

  card.append(top, el("h3", "card-title", task.title));
  if (task.description) card.append(el("p", "card-desc", task.description));

  // Tags
  const tags = el("div", "card-tags");
  tags.append(tag(`priority-${task.priority}`, PRIORITY_LABEL[task.priority]));
  if (overdue) tags.append(tag("tag-overdue", "Overdue", icons.warning));
  if (dueSoon) tags.append(el("span", "tag tag-soon", "Due Soon"));
  if (done) tags.append(tag("tag-done", "Done", icons.check));
  card.append(tags);

  // Due date and created time
  const info = el("div", "card-meta");
  if (task.dueDate) {
    info.append(meta(icons.calendar, formatDate(task.dueDate), overdue ? "is-overdue" : dueSoon ? "is-soon" : ""));
  }
  const created = meta(icons.clock, timeAgo(task.createdAt));
  created.title = `Created ${new Date(task.createdAt).toLocaleString()}`;
  info.append(created);
  card.append(info);

  // Move buttons for the other two columns
  const actions = el("div", "card-actions");
  for (const status of STATUSES) {
    if (status === task.status) continue;
    const { label, icon: iconClass } = moveButtons[status];
    const btn = actionButton("move", `move-btn move-${status}`, `Move to ${label}`);
    btn.dataset.status = status;
    btn.append(icon(iconClass), el("span", "", label));
    actions.append(btn);
  }
  card.append(actions);
  return card;
}

function renderEmpty(): HTMLElement {
  const empty = el("div", "empty");
  empty.append(icon(icons.empty), el("p", "", "No tasks yet"), el("small", "", "Click + to add one"));
  return empty;
}

function renderColumn(status: Status, title: string, tasks: Task[], numbers: Map<string, number>, today: string) {
  const badge = el("div", `column-icon icon-${status}`);
  badge.append(icon(columnIcons[status]));
  const heading = el("div", "");
  heading.append(el("h2", "column-title", title), el("p", "column-count", countLabel(tasks.length)));
  const header = el("div", "column-header");
  header.append(badge, heading);

  const list = el("div", "card-list");
  list.append(...(tasks.length ? tasks.map((t) => renderCard(t, numbers.get(t.id) ?? 0, today)) : [renderEmpty()]));

  const column = el("section", "column");
  column.dataset.status = status;
  column.append(header, list);
  return column;
}

// Draws all columns and their cards.
export function renderBoard(tasks: readonly Task[]): void {
  const today = todayISO();
  const numbers = new Map(tasks.map((t, i) => [t.id, i + 1]));
  const byStatus: Record<Status, Task[]> = { todo: [], "in-progress": [], done: [] };
  for (const task of tasks) byStatus[task.status].push(task);

  board.replaceChildren(...COLUMNS.map((c) => renderColumn(c.status, c.title, byStatus[c.status], numbers, today)));
}
