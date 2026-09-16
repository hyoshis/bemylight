import type { CareTask } from "@/lib/types";

export const DAILY_FOCUS_LIMIT = 3;

export function getFocusTasks(tasks: CareTask[]) {
  return tasks.filter((task) => task.inFocus).slice(0, DAILY_FOCUS_LIMIT);
}

export function canAddToFocus(tasks: CareTask[], taskId: string) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task || task.completed || task.inFocus) {
    return false;
  }

  return getFocusTasks(tasks).length < DAILY_FOCUS_LIMIT;
}

export function toggleFocusTask(tasks: CareTask[], taskId: string) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return tasks;
  }

  if (!task.inFocus && !canAddToFocus(tasks, taskId)) {
    return tasks;
  }

  return tasks.map((item) =>
    item.id === taskId ? { ...item, inFocus: !item.inFocus } : item,
  );
}

export function getTaskProgress(tasks: CareTask[]) {
  const focus = getFocusTasks(tasks);
  return {
    completed: focus.filter((task) => task.completed).length,
    total: focus.length,
  };
}
