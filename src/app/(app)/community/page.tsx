"use client";

import { FormEvent, useState } from "react";
import {
  ChevronDown,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useCare } from "@/components/care-provider";
import { communityTopicGroups } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
  const { posts, settings, addPost, addComment, toggleReaction } = useCare();
  const [draft, setDraft] = useState("");
  const [selectedPostTags, setSelectedPostTags] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const conditionTopics =
    communityTopicGroups.find((group) => group.id === "health-conditions")
      ?.topics ?? [];
  const primaryFilters = [
    { id: "aging-parents", label: "Aging parents", topics: ["Aging parents"] },
    {
      id: "long-distance",
      label: "Long-distance care",
      topics: ["Long-distance caregiving"],
    },
    {
      id: "new-caregiving",
      label: "New to caregiving",
      topics: ["New to caregiving"],
    },
    {
      id: "work-care",
      label: "Balancing work and care",
      topics: ["Balancing work and care"],
    },
  ];
  const postTagOptions = [
    ...primaryFilters.flatMap((filter) => filter.topics),
    ...conditionTopics,
  ];
  const visiblePosts = posts.filter((post) => {
    if (activeFilters.length === 0 && selectedConditions.length === 0) {
      return true;
    }

    const selectedTopics = primaryFilters
      .filter((filter) => activeFilters.includes(filter.id))
      .flatMap((filter) => filter.topics);

    const postTags = post.tags?.length ? post.tags : [post.topic];
    return postTags.some((postTag) =>
      [...selectedTopics, ...selectedConditions].includes(postTag),
    );
  });

  function toggleFilter(filterId: string) {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((item) => item !== filterId)
        : [...current, filterId],
    );
    setConditionsOpen(false);
  }

  function toggleCondition(condition: string) {
    setSelectedConditions((current) =>
      current.includes(condition)
        ? current.filter((item) => item !== condition)
        : [...current, condition],
    );
  }

  function togglePostTag(tag: string) {
    setSelectedPostTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    if (selectedPostTags.length === 0) {
      setNotice("Choose at least one tag for your post.");
      return;
    }
    addPost(body, selectedPostTags);
    setDraft("");
    setSelectedPostTags([]);
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
            CareTogether ID.
          </p>
        </div>
        <div className="safety-chip">
          <ShieldCheck size={17} aria-hidden="true" />
          Pseudonymous space
        </div>
      </header>

      <div className="topic-scroller" aria-label="Community topics">
        <button
          className={cn(
            "topic-pill",
            activeFilters.length === 0 &&
              selectedConditions.length === 0 &&
              "is-active",
          )}
          type="button"
          onClick={() => {
            setActiveFilters([]);
            setSelectedConditions([]);
            setConditionsOpen(false);
          }}
        >
          My circles
        </button>
        {primaryFilters.map((filter) => (
          <button
            className={cn(
              "topic-pill",
              activeFilters.includes(filter.id) && "is-active",
            )}
            type="button"
            key={filter.id}
            aria-pressed={activeFilters.includes(filter.id)}
            onClick={() => toggleFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
        <div className="condition-filter">
          <button
            className={cn(
              "topic-pill",
              "condition-filter-button",
              selectedConditions.length > 0 && "is-active",
            )}
            type="button"
            aria-expanded={conditionsOpen}
            onClick={() => setConditionsOpen((open) => !open)}
          >
            Diseases & symptoms
            {selectedConditions.length > 0 ? (
              <span className="filter-count">{selectedConditions.length}</span>
            ) : null}
            <ChevronDown
              className={cn("filter-chevron", conditionsOpen && "is-open")}
              size={16}
              aria-hidden="true"
            />
          </button>
          {conditionsOpen ? (
            <div className="condition-filter-menu">
              <div>
                <strong>Diseases & symptoms</strong>
                <span>Choose one or more</span>
              </div>
              {conditionTopics.map((condition) => (
                <label key={condition}>
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(condition)}
                    onChange={() => toggleCondition(condition)}
                  />
                  <span>{condition}</span>
                </label>
              ))}
              <div className="condition-filter-actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setSelectedConditions([])}
                >
                  Clear
                </button>
                <button
                  className="button button-primary button-small"
                  type="button"
                  onClick={() => setConditionsOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <form className="compose-card" onSubmit={publish}>
        <div className="compose-heading">
          <span className="avatar">{settings.displayName.slice(0, 2)}</span>
          <div>
            <strong>Share with people who get it</strong>
            <small>Post as {settings.displayName}</small>
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
        <div className="post-tag-picker">
          <p className="muted-label">Add tags</p>
          <div className="post-tag-options">
            {postTagOptions.map((tag) => (
              <button
                className={cn(
                  "post-tag-option",
                  selectedPostTags.includes(tag) && "is-selected",
                )}
                type="button"
                key={tag}
                aria-pressed={selectedPostTags.includes(tag)}
                onClick={() => togglePostTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="compose-actions">
          <span className="selected-tag-count">
            {selectedPostTags.length > 0
              ? `${selectedPostTags.length} selected`
              : "Select at least one tag"}
          </span>
          <button className="button button-primary button-small" type="submit">
            <PenLine size={16} aria-hidden="true" />
            Share
          </button>
        </div>
        {notice ? <p className="form-success" role="status">{notice}</p> : null}
      </form>

      <div className="feed">
        {visiblePosts.map((post) => (
          <article className="post-card" key={post.id}>
            <header className="post-header">
              <div className="post-meta">
                <span className="avatar">{post.author.slice(0, 2)}</span>
                <div>
                  <strong>{post.author}</strong>
                  <small>{post.createdAt}</small>
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
            <div className="post-tag-row">
              {(post.tags?.length ? post.tags : [post.topic]).map((postTag) => (
                <span className="soft-tag" key={postTag}>
                  {postTag}
                </span>
              ))}
            </div>
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
                {visiblePosts.length === 0 ? (
                  <div className="panel community-empty">
                    <h2>No posts here yet</h2>
                    <p>Start the conversation by sharing a question or small update.</p>
                  </div>
                ) : null}
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
