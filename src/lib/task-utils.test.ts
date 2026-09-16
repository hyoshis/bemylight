import { describe, expect, it } from "vitest";
import {
  canAddToFocus,
  getFocusTasks,
  getTaskProgress,
  toggleFocusTask,
} from "@/lib/task-utils";
import type { CareTask } from "@/lib/types";

const tasks: CareTask[] = [
  {
    id: "one",
    title: "One",
    category: "care",
    completed: false,
    inFocus: true,
    createdAt: "2026-09-15T00:00:00.000Z",
  },
  {
    id: "two",
    title: "Two",
    category: "paperwork",
    completed: true,
    inFocus: true,
    createdAt: "2026-09-15T00:00:00.000Z",
  },
  {
    id: "three",
    title: "Three",
    category: "self-care",
    completed: false,
    inFocus: false,
    createdAt: "2026-09-15T00:00:00.000Z",
  },
];

describe("daily focus tasks", () => {
  it("returns focused tasks and progress", () => {
    expect(getFocusTasks(tasks).map((task) => task.id)).toEqual(["one", "two"]);
    expect(getTaskProgress(tasks)).toEqual({ completed: 1, total: 2 });
  });

  it("adds an eligible backlog task to focus", () => {
    expect(canAddToFocus(tasks, "three")).toBe(true);
    expect(
      toggleFocusTask(tasks, "three").find((task) => task.id === "three")
        ?.inFocus,
    ).toBe(true);
  });

  it("does not exceed three focused tasks", () => {
    const fullTasks: CareTask[] = [
      ...tasks,
      {
        id: "four",
        title: "Four",
        category: "household",
        completed: false,
        inFocus: true,
        createdAt: "2026-09-15T00:00:00.000Z",
      },
      {
        id: "five",
        title: "Five",
        category: "appointment",
        completed: false,
        inFocus: false,
        createdAt: "2026-09-15T00:00:00.000Z",
      },
    ];

    expect(canAddToFocus(fullTasks, "five")).toBe(false);
    expect(toggleFocusTask(fullTasks, "five")).toBe(fullTasks);
  });

  it("does not focus completed tasks", () => {
    const completedBacklog = tasks.map((task) =>
      task.id === "three" ? { ...task, completed: true } : task,
    );
    expect(canAddToFocus(completedBacklog, "three")).toBe(false);
  });
});
