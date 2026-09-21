"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Flag, Send, ShieldCheck } from "lucide-react";
import { useCare } from "@/components/care-provider";
import { filterByAudience } from "@/lib/demo-data";

export default function ConversationPage() {
  const { conversations, settings, sendMessage } = useCare();
  const [draft, setDraft] = useState("");
  const roleConversations = filterByAudience(
    conversations,
    settings.communityRole,
  );
  const conversation = roleConversations[0];

  if (!conversation) {
    return (
      <div className="empty-state full-empty">
        <h1>Conversation not found</h1>
        <Link className="button button-secondary" href="/messages">
          Back to messages
        </Link>
      </div>
    );
  }

  const conversationId = conversation.id;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    sendMessage(conversationId, body);
    setDraft("");
  }

  return (
    <div className="conversation-page">
      <header className="conversation-header">
        <Link className="icon-button" href="/messages" aria-label="Back to messages">
          <ArrowLeft size={20} />
        </Link>
        <span className="avatar">{conversation.person.slice(0, 2)}</span>
        <div>
          <h1>{conversation.person}</h1>
          <p>{conversation.subtitle}</p>
        </div>
        <button className="icon-button conversation-report" type="button" aria-label="Report conversation">
          <Flag size={18} />
        </button>
      </header>

      <div className="message-safety-note">
        <ShieldCheck size={16} aria-hidden="true" />
        Take your time. Never share information that does not feel safe.
      </div>

      <div className="message-thread" aria-live="polite">
        {conversation.messages.map((message) => (
          <div
            className={`message-bubble ${
              message.sender === "me" ? "from-me" : "from-them"
            }`}
            key={message.id}
          >
            <p>{message.body}</p>
            <time>{message.createdAt}</time>
          </div>
        ))}
      </div>

      <form className="message-composer" onSubmit={submit}>
        <label className="sr-only" htmlFor="message">
          Message {conversation.person}
        </label>
        <textarea
          id="message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a kind message..."
          rows={2}
          maxLength={1000}
        />
        <button className="button button-primary" type="submit">
          <Send size={18} aria-hidden="true" />
          Send
        </button>
      </form>
    </div>
  );
}
