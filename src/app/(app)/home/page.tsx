"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Circle,
  Heart,
  MessageCircle,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useCare } from "@/components/care-provider";
import { getFocusTasks, getTaskProgress } from "@/lib/task-utils";
import { cn } from "@/lib/utils";

export default function TodayPage() {
  const {
    tasks,
    posts,
    connections,
    settings,
    encouragement,
    toggleTask,
  } = useCare();
  const focusTasks = getFocusTasks(tasks);
  const progress = getTaskProgress(tasks);
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
        <div className="header-date" aria-label="Tuesday, September 15">
          <strong>15</strong>
          <span>SEP</span>
        </div>
      </header>

      <section className="encouragement-strip">
        <span className="sparkle-badge" aria-hidden="true">
          <Sparkles size={18} />
        </span>
        <div>
          <p className="muted-label">A thought for today</p>
          <blockquote>{encouragement.text}</blockquote>
        </div>
        <Link className="icon-button" href="/encouragement" aria-label="More encouragement">
          <ArrowRight size={19} />
        </Link>
      </section>

      <div className="dashboard-grid">
        <section className="panel focus-panel">
          <div className="section-heading-row">
            <div>
              <p className="muted-label">What matters now</p>
              <h2>Your small steps</h2>
            </div>
            <span className="progress-pill">
              {progress.completed} of {progress.total}
            </span>
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
                  <small>
                    {task.category.replace("-", " ")}
                    {task.dueLabel ? ` · ${task.dueLabel}` : ""}
                  </small>
                </span>
              </button>
            ))}
          </div>

          <Link className="button button-secondary button-full" href="/tasks">
            <Plus size={18} aria-hidden="true" />
            Add or choose a small step
          </Link>
        </section>

        <aside className="panel check-in-panel">
          <span className="feature-icon peach">
            <Heart size={21} aria-hidden="true" />
          </span>
          <div>
            <p className="muted-label">A moment for you</p>
            <h2>How are you holding up?</h2>
            <p>
              There is no wrong answer. Even noticing how you feel is a form of
              care.
            </p>
          </div>
          <div className="mood-row" aria-label="Choose how you feel">
            {["Heavy", "Tired", "Okay", "Steady"].map((mood) => (
              <button type="button" key={mood}>
                {mood}
              </button>
            ))}
          </div>
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
          <span>QH</span>
          <span>WM</span>
          <span>HF</span>
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
