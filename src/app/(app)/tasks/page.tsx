"use client";

import { FormEvent, useState } from "react";
import { Check, Circle, Plus, Star, Target } from "lucide-react";
import { useCare } from "@/components/care-provider";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const { tasks, addTask, toggleTask, toggleTaskFocus } = useCare();
  const [title, setTitle] = useState("");
  const [activeTab, setActiveTab] = useState<"tasks" | "completed">("tasks");
  const activeTasks = [...tasks]
    .filter((task) => !task.completed)
    .sort((first, second) => Number(second.inFocus) - Number(first.inFocus));
  const completedTasks = tasks.filter((task) => task.completed);

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    addTask(cleanTitle);
    setTitle("");
    setActiveTab("tasks");
  }

  return (
    <div className="page-stack narrow-page">
      <header className="focus-guidance-header">
        <div>
          <p className="eyebrow">My focus</p>
          <h1>Focus on what you can control.</h1>
          <p>
            Things can feel overwhelming. Start with one step you can take now,
            then star what needs your attention first.
          </p>
        </div>
        <span className="focus-guidance-icon" aria-hidden="true">
          <Target size={27} />
        </span>
      </header>

      <form className="quick-add task-quick-add" onSubmit={submitTask}>
        <label className="sr-only" htmlFor="new-task">
          New task
        </label>
        <input
          id="new-task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What can you take care of now?"
          maxLength={120}
        />
        <button
          className="icon-button task-add-button"
          type="submit"
          aria-label="Add task"
        >
          <Plus size={19} aria-hidden="true" />
        </button>
      </form>

      <section className="panel task-panel">
        <div className="task-tabs" role="tablist" aria-label="Task lists">
          <button
            className={cn(activeTab === "tasks" && "is-active")}
            type="button"
            role="tab"
            aria-selected={activeTab === "tasks"}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks <span>{activeTasks.length}</span>
          </button>
          <button
            className={cn(activeTab === "completed" && "is-active")}
            type="button"
            role="tab"
            aria-selected={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
          >
            Completed <span>{completedTasks.length}</span>
          </button>
        </div>

        {activeTab === "tasks" ? (
          <div className="task-list unified-task-list" role="tabpanel">
            {activeTasks.map((task) => (
              <div className="task-row" key={task.id}>
                <button
                  className="task-toggle"
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={`Complete ${task.title}`}
                >
                  <Circle size={18} />
                </button>
                <div className="task-copy">
                  <strong>{task.title}</strong>
                  {task.dueLabel ? <small>{task.dueLabel}</small> : null}
                </div>
                <button
                  className={cn(
                    "icon-button",
                    "task-star",
                    task.inFocus && "is-starred",
                  )}
                  type="button"
                  onClick={() => toggleTaskFocus(task.id)}
                  aria-pressed={task.inFocus}
                  aria-label={
                    task.inFocus
                      ? `Remove ${task.title} from focus`
                      : `Add ${task.title} to focus`
                  }
                >
                  <Star
                    size={18}
                    fill={task.inFocus ? "currentColor" : "none"}
                  />
                </button>
              </div>
            ))}
            {activeTasks.length === 0 ? (
              <div className="empty-state">
                <h3>Your task list is clear.</h3>
                <p>Add something when you are ready.</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="task-list unified-task-list" role="tabpanel">
            {completedTasks.map((task) => (
              <div className="task-row is-done" key={task.id}>
                <button
                  className="task-toggle"
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={`Restore ${task.title}`}
                >
                  <Check size={16} />
                </button>
                <div className="task-copy">
                  <strong>{task.title}</strong>
                  {task.dueLabel ? <small>{task.dueLabel}</small> : null}
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
            {completedTasks.length === 0 ? (
              <div className="empty-state">
                <h3>No completed tasks yet.</h3>
                <p>Checked-off tasks will appear here.</p>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
