"use client";

import Link from "next/link";
import {
  Check,
  Circle,
  Heart,
  MessageCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { useCare } from "@/components/care-provider";
import { getFocusTasks } from "@/lib/task-utils";
import { cn } from "@/lib/utils";

export default function TodayPage() {
  const {
    tasks,
    posts,
    connections,
    settings,
    encouragement,
    toggleTask,
    rotateEncouragement,
  } = useCare();
  const focusTasks = getFocusTasks(tasks);
  const connectedCount = connections.filter(
    (connection) => connection.status === "connected",
  ).length;

  return (
    <div className="page-stack">
      <header className="page-header warm-header">
        <div>
          <p className="eyebrow">Your day, at a gentler pace</p>
          <h1>Good evening, {settings.displayName}.</h1>
          <p>
            You do not need to solve everything today. Let&apos;s choose what
            matters now.
          </p>
        </div>
        <div className="header-date" aria-label="Thursday, September 17">
          <strong>17</strong>
          <span>SEP</span>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="panel focus-panel">
          <div className="section-heading-row">
            <div>
              <p className="muted-label">What matters now</p>
              <h2>Your focus</h2>
            </div>
            <span className="progress-pill">{focusTasks.length} focused</span>
          </div>

          <div className="focus-list">
            {focusTasks.map((task) => (
              <button
                type="button"
                className={cn("focus-task", task.completed && "is-done")}
                key={task.id}
                onClick={() => toggleTask(task.id)}
                aria-pressed={task.completed}
              >
                <span className="task-check" aria-hidden="true">
                  {task.completed ? <Check size={16} /> : <Circle size={17} />}
                </span>
                <span className="task-copy">
                  <strong>{task.title}</strong>
                  {task.dueLabel ? <small>{task.dueLabel}</small> : null}
                </span>
              </button>
            ))}
          </div>

          <Link className="button button-secondary button-full" href="/tasks">
            <Plus size={18} aria-hidden="true" />
            Add or choose a focus item
          </Link>
        </section>

        <aside className="panel today-encouragement-panel">
          <div className="today-encouragement-heading">
            <span className="feature-icon" aria-hidden="true">
              <Sparkles size={19} />
            </span>
            <h2>A moment for you</h2>
          </div>
          <blockquote>{encouragement.text}</blockquote>
          <div className="reflection-prompt">
            <span>Consider this</span>
            <p>{encouragement.prompt}</p>
          </div>
          <button
            className="text-button encouragement-refresh"
            type="button"
            onClick={rotateEncouragement}
          >
            <RefreshCw size={15} aria-hidden="true" />
            Another thought
          </button>
        </aside>
      </div>

      <section className="section-block">
        <div className="section-heading-row">
          <div>
            <p className="muted-label">You are not alone</p>
            <h2>From your circles</h2>
          </div>
          <Link className="text-link" href="/community">
            See community
          </Link>
        </div>
        <div className="community-preview-grid">
          {posts.slice(0, 2).map((post) => (
            <article className="post-card compact-post" key={post.id}>
              <div className="post-meta">
                <span className="avatar">{post.author.slice(0, 2)}</span>
                <div>
                  <strong>{post.author}</strong>
                  <small>
                    {post.topic} · {post.createdAt}
                  </small>
                </div>
              </div>
              <p>{post.body}</p>
              <div className="post-stats">
                <span>
                  <Heart size={15} aria-hidden="true" /> {post.reactions}
                </span>
                <span>
                  <MessageCircle size={15} aria-hidden="true" />{" "}
                  {post.comments.length}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="connection-callout">
        <div className="connection-avatars" aria-hidden="true">
          <span>N2</span>
          <span>KJ</span>
          <span>M8</span>
        </div>
        <div>
          <h2>Care feels lighter when it is shared.</h2>
          <p>
            You have {connectedCount} connection and new people with experiences
            similar to yours.
          </p>
        </div>
        <Link className="button button-primary" href="/connections">
          Find a connection
          <Users size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
