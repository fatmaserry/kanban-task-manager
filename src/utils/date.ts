import { DUE_SOON_DAYS } from "../models/task.js";

const DAY = 24 * 60 * 60 * 1000;

// Today's date as yyyy-mm-dd in local time.
export function todayISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function parseISO(iso: string): Date {
  const [y = 0, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// "2026-11-05" -> "Nov 5"
export function formatDate(iso: string): string {
  return parseISO(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// True when the date is today or within the next few days.
export function isDueSoon(iso: string, today: string): boolean {
  const days = Math.round((parseISO(iso).getTime() - parseISO(today).getTime()) / DAY);
  return days >= 0 && days <= DUE_SOON_DAYS;
}

// "Just now", "5m ago", "3h ago", "2d ago", then the date.
export function timeAgo(time: number): string {
  const minutes = Math.floor((Date.now() - time) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(time).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
