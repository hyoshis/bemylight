"use client";

import Link from "next/link";
import {
  Check,
  Circle,
  Heart,
  MessageCircle,
  Mic,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { useCare } from "@/components/care-provider";
import {
  filterByAudience,
  getCommunityTopicGroups,
  getRoleCopy,
} from "@/lib/demo-data";
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
  const copy = getRoleCopy(settings.communityRole);
  const focusTasks = getFocusTasks(tasks);
  const roleConnections = filterByAudience(connections, settings.communityRole);
  const connectedCount = roleConnections.filter(
    (connection) => connection.status === "connected",
  ).length;
  const roleTopics = getCommunityTopicGroups(settings.communityRole).flatMap(
    (group) => [...group.topics],
  ) as string[];
  const communityPosts = filterByAudience(
    posts,
    settings.communityRole,
  ).filter((post) => {
    const postTags = post.tags?.length ? post.tags : [post.topic];
    return postTags.some((tag) => roleTopics.includes(tag));
  });

  return (
    <div className="page-stack">
      <header className="page-header warm-header">
        <div>
          <p className="eyebrow">{copy.todayEyebrow}</p>
          <h1>Good evening, {settings.displayName || "friend"}.</h1>
          <p>{copy.todayLede}</p>
        </div>
        <div className="header-date" aria-label="Thursday, September 17">
          <strong>17</strong>
          <span>SEP</span>
        </div>
      </header>

      <div className="home-focus-layout">
        <section className="panel focus-panel">
          <div className="section-heading-row">
            <div>
              <p className="muted-label">Next priority</p>
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
                  {task.detail ? (
                    <small className="task-detail">{task.detail}</small>
                  ) : null}
                  {task.dueLabel ? <small>{task.dueLabel}</small> : null}
                </span>
              </button>
            ))}
            {focusTasks.length === 0 ? (
              <div className="empty-inline">
                <p>Nothing is starred yet. Choose what matters today.</p>
              </div>
            ) : null}
          </div>

          <div className="focus-panel-actions">
            <Link className="button button-primary" href="/tasks">
              <Mic size={18} aria-hidden="true" />
              {settings.communityRole === "affected"
                ? "Say it, hand it off"
                : "Say it, turn it into tasks"}
            </Link>
            <Link className="button button-secondary" href="/tasks">
              <Plus size={18} aria-hidden="true" />
              Manage focus
            </Link>
          </div>
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

      <section className="home-community-section">
        <div className="section-heading-row">
          <div>
            <p className="muted-label">From your circles</p>
            <h2>Community conversations</h2>
          </div>
          <Link className="text-link" href="/community">
            See all posts
          </Link>
        </div>

        <div className="home-post-feed">
          {communityPosts.slice(0, 4).map((post) => (
            <article className="post-card home-post-card" key={post.id}>
              <div className="post-meta">
                <span className="avatar">{post.author.slice(0, 2)}</span>
                <div>
                  <strong>{post.author}</strong>
                  <small>{post.createdAt}</small>
                </div>
              </div>
              <div className="post-tag-row">
                {(post.tags?.length ? post.tags : [post.topic]).map((tag) => (
                  <span className="soft-tag" key={tag}>
                    {tag}
                  </span>
                ))}
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
          {roleConnections.slice(0, 3).map((connection) => (
            <span key={connection.id}>{connection.name.slice(0, 2)}</span>
          ))}
        </div>
        <div>
          <h2>{copy.connectionCalloutTitle}</h2>
          <p>
            You have {connectedCount}{" "}
            {connectedCount === 1 ? "connection" : "connections"} here, plus{" "}
            {copy.connectionCalloutBody}
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
