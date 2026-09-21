"use client";

import { FormEvent, useState } from "react";
import { Check, Circle, Plus, Share2, Star, Target, Users } from "lucide-react";
import { useCare } from "@/components/care-provider";
import { VoiceTaskCapture } from "@/components/voice-task-capture";
import { getRoleCopy } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const {
    tasks,
    settings,
    sharedTaskLists,
    addTask,
    addTasks,
    toggleTask,
    toggleTaskFocus,
    shareTaskList,
    toggleSharedTask,
    markSharedTaskListsSeen,
  } = useCare();
  const [title, setTitle] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const [activeTab, setActiveTab] = useState<
    "tasks" | "shared" | "completed"
  >("tasks");
  const isAffected = settings.communityRole === "affected";
  const copy = getRoleCopy(settings.communityRole);
  const activeTasks = [...tasks]
    .filter((task) => !task.completed)
    .sort((first, second) => Number(second.inFocus) - Number(first.inFocus));
  const completedTasks = tasks.filter((task) => task.completed);
  const sharedLists = sharedTaskLists.filter((list) =>
    isAffected
      ? list.audience === "affected" &&
        (list.ownerId === "current-user" ||
          list.ownerId === settings.displayName ||
          list.ownerId === "you")
      : list.audience === "caregiver" &&
        (list.recipientId === "current-user" ||
          list.recipientId === settings.displayName),
  );
  const unseenSharedLists = isAffected
    ? 0
    : sharedLists.filter((list) => !list.seen).length;

  function openSharedTab() {
    setActiveTab("shared");
    markSharedTaskListsSeen();
  }

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    addTask(cleanTitle);
    setTitle("");
    setActiveTab("tasks");
  }

  function submitShare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanId = recipientId.trim();
    if (!cleanId) return;
    shareTaskList(cleanId);
    setShareNotice(`Shared ${activeTasks.length} tasks with ${cleanId}.`);
    setRecipientId("");
  }

  return (
    <div className="page-stack narrow-page">
      <header className="focus-guidance-header">
        <div>
          <p className="eyebrow">{copy.tasksEyebrow}</p>
          <h1>{copy.tasksTitle}</h1>
          <p>{copy.tasksLede}</p>
        </div>
        <span className="focus-guidance-icon" aria-hidden="true">
          <Target size={27} />
        </span>
      </header>

      <VoiceTaskCapture
        role={settings.communityRole}
        onAddTasks={(titles) => {
          addTasks(titles);
          setActiveTab("tasks");
        }}
      />

      <form className="quick-add task-quick-add" onSubmit={submitTask}>
        <label className="sr-only" htmlFor="new-task">
          New task
        </label>
        <input
          id="new-task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={copy.taskPlaceholder}
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

      {isAffected ? (
        <form className="task-share-panel" onSubmit={submitShare}>
          <span className="task-share-icon" aria-hidden="true">
            <Share2 size={19} />
          </span>
          <div>
            <strong>Hand this list to someone</strong>
            <p>
              Enter the Be My Light ID of the person helping you. You stay in
              charge of what is on it.
            </p>
          </div>
          <label className="sr-only" htmlFor="share-recipient">
            Community ID
          </label>
          <input
            id="share-recipient"
            value={recipientId}
            onChange={(event) => {
              setRecipientId(event.target.value);
              setShareNotice("");
            }}
            placeholder="Community ID"
            maxLength={40}
          />
          <button className="button button-secondary button-small" type="submit">
            Share list
          </button>
          {shareNotice ? (
            <span className="task-share-notice" role="status">
              {shareNotice}
            </span>
          ) : null}
        </form>
      ) : null}

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
          {!isAffected ? (
            <button
              className={cn(activeTab === "shared" && "is-active")}
              type="button"
              role="tab"
              aria-selected={activeTab === "shared"}
              onClick={openSharedTab}
            >
              <span className="tab-label-with-dot">
                Shared with me
                {unseenSharedLists > 0 ? (
                  <span
                    className="tab-notification-dot"
                    aria-label={`${unseenSharedLists} new shared list`}
                  />
                ) : null}
              </span>
              <span>{sharedLists.length}</span>
            </button>
          ) : null}
          {isAffected ? (
            <button
              className={cn(activeTab === "shared" && "is-active")}
              type="button"
              role="tab"
              aria-selected={activeTab === "shared"}
              onClick={() => setActiveTab("shared")}
            >
              Handed off <span>{sharedLists.length}</span>
            </button>
          ) : null}
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
                  {task.detail ? (
                    <small className="task-detail">{task.detail}</small>
                  ) : null}
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
        ) : activeTab === "shared" ? (
          <div className="shared-task-lists" role="tabpanel">
            {sharedLists.map((list) => (
              <article className="shared-task-card" key={list.id}>
                <header>
                  <span className="task-share-icon" aria-hidden="true">
                    <Users size={18} />
                  </span>
                  <div>
                    <strong>{isAffected ? list.recipientId : list.ownerId}</strong>
                    <small>
                      {isAffected
                        ? `You shared this ${list.sharedAt.toLowerCase()}`
                        : `Shared ${list.sharedAt}`}
                    </small>
                  </div>
                </header>
                <div className="shared-task-items">
                  {list.tasks.map((task) => (
                    <button
                      className={cn(
                        "shared-task-item",
                        task.completed && "is-done",
                      )}
                      type="button"
                      key={task.id}
                      aria-pressed={task.completed}
                      onClick={() => toggleSharedTask(list.id, task.id)}
                    >
                      {task.completed ? (
                        <Check size={16} aria-hidden="true" />
                      ) : (
                        <Circle size={16} aria-hidden="true" />
                      )}
                      <span>
                        {task.title}
                        {task.detail ? (
                          <small className="task-detail">{task.detail}</small>
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
            {sharedLists.length === 0 ? (
              <div className="empty-state">
                <h3>
                  {isAffected
                    ? "You have not handed off a list yet."
                    : "No lists have been shared with you."}
                </h3>
                <p>
                  {isAffected
                    ? "When you share a list, it will appear here so you can see what you asked for."
                    : "Shared tasks will appear here when someone sends a list."}
                </p>
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
