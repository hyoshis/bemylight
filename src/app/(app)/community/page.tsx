"use client";

import { FormEvent, useState } from "react";
import {
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useCare } from "@/components/care-provider";
import { careTopics } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
  const { posts, addPost, addComment, toggleReaction } = useCare();
  const [draft, setDraft] = useState("");
  const [topic, setTopic] = useState<(typeof careTopics)[number]>(
    "New to caregiving",
  );
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    addPost(body, topic);
    setDraft("");
    setNotice("Your post is now visible to the community.");
  }

  function submitComment(event: FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();
    const body = commentDrafts[postId]?.trim();
    if (!body) return;
    addComment(postId, body);
    setCommentDrafts((current) => ({ ...current, [postId]: "" }));
  }

  return (
    <div className="page-stack community-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">People who understand</p>
          <h1>Community</h1>
          <p>
            Share only what feels safe. You can participate under your
            CareTogether name.
          </p>
        </div>
        <div className="safety-chip">
          <ShieldCheck size={17} aria-hidden="true" />
          Pseudonymous space
        </div>
      </header>

      <div className="topic-scroller" aria-label="Community topics">
        <button className="topic-pill is-active" type="button">
          My circles
        </button>
        {careTopics.map((item) => (
          <button className="topic-pill" type="button" key={item}>
            {item}
          </button>
        ))}
      </div>

      <form className="compose-card" onSubmit={publish}>
        <div className="compose-heading">
          <span className="avatar">QL</span>
          <div>
            <strong>Share with people who get it</strong>
            <small>Post as your pseudonym</small>
          </div>
        </div>
        <label className="sr-only" htmlFor="new-post">
          What would you like to share?
        </label>
        <textarea
          id="new-post"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask a question, share a small win, or say what is hard today..."
          maxLength={1000}
          rows={3}
        />
        <div className="compose-actions">
          <label>
            <span className="sr-only">Choose a topic</span>
            <select
              value={topic}
              onChange={(event) =>
                setTopic(event.target.value as (typeof careTopics)[number])
              }
            >
              {careTopics.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <button className="button button-primary button-small" type="submit">
            <PenLine size={16} aria-hidden="true" />
            Share
          </button>
        </div>
        {notice ? <p className="form-success" role="status">{notice}</p> : null}
      </form>

      <div className="feed">
        {posts.map((post) => (
          <article className="post-card" key={post.id}>
            <header className="post-header">
              <div className="post-meta">
                <span className="avatar">{post.author.slice(0, 2)}</span>
                <div>
                  <strong>{post.author}</strong>
                  <small>
                    {post.topic} · {post.createdAt}
                  </small>
                </div>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label={`More options for ${post.author}'s post`}
              >
                <MoreHorizontal size={19} />
              </button>
            </header>
            <p className="post-body">{post.body}</p>
            <div className="post-actions">
              <button
                type="button"
                className={cn("post-action", post.reacted && "is-reacted")}
                onClick={() => toggleReaction(post.id)}
                aria-pressed={post.reacted}
              >
                <Heart
                  size={17}
                  fill={post.reacted ? "currentColor" : "none"}
                />
                Support {post.reactions > 0 ? post.reactions : ""}
              </button>
              <span className="post-action">
                <MessageCircle size={17} aria-hidden="true" />
                {post.comments.length}{" "}
                {post.comments.length === 1 ? "reply" : "replies"}
              </span>
              <button
                type="button"
                className="post-action report-action"
                onClick={() =>
                  setNotice(
                    "Report noted in this preview. Production reports enter a private moderator queue.",
                  )
                }
              >
                <Flag size={15} aria-hidden="true" />
                Report
              </button>
            </div>
            {post.comments.length > 0 ? (
              <div className="comments">
                {post.comments.map((comment) => (
                  <div className="comment" key={comment.id}>
                    <span className="avatar avatar-small">
                      {comment.author.slice(0, 2)}
                    </span>
                    <div>
                      <strong>{comment.author}</strong>
                      <p>{comment.body}</p>
                      <small>{comment.createdAt}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <form
              className="comment-form"
              onSubmit={(event) => submitComment(event, post.id)}
            >
              <label className="sr-only" htmlFor={`comment-${post.id}`}>
                Reply to {post.author}
              </label>
              <input
                id={`comment-${post.id}`}
                value={commentDrafts[post.id] ?? ""}
                onChange={(event) =>
                  setCommentDrafts((current) => ({
                    ...current,
                    [post.id]: event.target.value,
                  }))
                }
                placeholder="Write a supportive reply..."
                maxLength={500}
              />
              <button
                className="icon-button"
                type="submit"
                aria-label="Send reply"
              >
                <Send size={17} />
              </button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
