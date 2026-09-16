"use client";

import { FormEvent, useState } from "react";
import {
  Check,
  Circle,
  GripVertical,
  Leaf,
  ListTodo,
  Plus,
  Star,
} from "lucide-react";
import { useCare } from "@/components/care-provider";
import { DAILY_FOCUS_LIMIT, getFocusTasks } from "@/lib/task-utils";
import type { TaskCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const categories: TaskCategory[] = [
  "care",
  "appointment",
  "paperwork",
  "household",
  "self-care",
];

export default function TasksPage() {
  const { tasks, addTask, toggleTask, toggleTaskFocus } = useCare();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("care");
  const focusTasks = getFocusTasks(tasks);
  const backlog = tasks.filter((task) => !task.inFocus && !task.completed);
  const completed = tasks.filter((task) => task.completed);

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    addTask(cleanTitle, category);
    setTitle("");
  }

  return (
    <div className="page-stack narrow-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">One thing at a time</p>
          <h1>My focus</h1>
          <p>
            Keep today small. Choose up to three actions that feel possible.
          </p>
        </div>
      </header>

      <form className="quick-add" onSubmit={submitTask}>
        <label className="sr-only" htmlFor="new-task">
          New task
        </label>
        <Plus size={19} aria-hidden="true" />
        <input
          id="new-task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What is one small thing you can do?"
          maxLength={120}
        />
        <label className="sr-only" htmlFor="task-category">
          Category
        </label>
        <select
          id="task-category"
          value={category}
          onChange={(event) => setCategory(event.target.value as TaskCategory)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item.replace("-", " ")}
            </option>
          ))}
        </select>
        <button className="button button-primary button-small" type="submit">
          Add
        </button>
      </form>

      <section className="panel">
        <div className="section-heading-row">
          <div>
            <p className="muted-label">Today</p>
            <h2>Your three small steps</h2>
          </div>
          <span className="progress-pill">
            {focusTasks.length} / {DAILY_FOCUS_LIMIT} chosen
          </span>
        </div>
        <div className="task-list">
          {focusTasks.map((task) => (
            <div className={cn("task-row", task.completed && "is-done")} key={task.id}>
              <GripVertical className="drag-hint" size={18} aria-hidden="true" />
              <button
                className="task-toggle"
                type="button"
                onClick={() => toggleTask(task.id)}
                aria-label={
                  task.completed
                    ? `Mark ${task.title} incomplete`
                    : `Complete ${task.title}`
                }
              >
                {task.completed ? <Check size={16} /> : <Circle size={18} />}
              </button>
              <div className="task-copy">
                <strong>{task.title}</strong>
                <small>
                  {task.category.replace("-", " ")}
                  {task.dueLabel ? ` · ${task.dueLabel}` : ""}
                </small>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => toggleTaskFocus(task.id)}
                aria-label={`Move ${task.title} to the backlog`}
              >
                <Star size={17} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
        {focusTasks.length === 0 ? (
          <div className="empty-state">
            <Leaf size={28} aria-hidden="true" />
            <h3>Today can begin with one small thing.</h3>
            <p>Choose an item from your backlog when you are ready.</p>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <div className="section-heading-row">
          <div>
            <p className="muted-label">Not for right now</p>
            <h2>Your backlog</h2>
          </div>
          <ListTodo size={22} aria-hidden="true" />
        </div>
        <div className="task-list">
          {backlog.map((task) => {
            const focusIsFull = focusTasks.length >= DAILY_FOCUS_LIMIT;
            return (
              <div className="task-row" key={task.id}>
                <span className="category-dot" data-category={task.category} />
                <div className="task-copy">
                  <strong>{task.title}</strong>
                  <small>{task.category.replace("-", " ")}</small>
                </div>
                <button
                  className="button button-quiet button-small"
                  type="button"
                  disabled={focusIsFull}
                  title={
                    focusIsFull
                      ? "Complete or remove a focus task first"
                      : undefined
                  }
                  onClick={() => toggleTaskFocus(task.id)}
                >
                  Add to today
                </button>
              </div>
            );
          })}
          {backlog.length === 0 ? (
            <p className="empty-inline">Nothing waiting in your backlog.</p>
          ) : null}
        </div>
      </section>

      <details className="completed-details">
        <summary>{completed.length} completed small steps</summary>
        <div className="task-list">
          {completed.map((task) => (
            <div className="task-row is-done" key={task.id}>
              <Check size={17} aria-hidden="true" />
              <div className="task-copy">
                <strong>{task.title}</strong>
                <small>{task.category.replace("-", " ")}</small>
              </div>
              <button
                className="text-button"
                type="button"
                onClick={() => toggleTask(task.id)}
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
