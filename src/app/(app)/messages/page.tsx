"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, MessageCircleHeart } from "lucide-react";
import { useCare } from "@/components/care-provider";

export default function MessagesPage() {
  const { conversations } = useCare();

  return (
    <div className="page-stack narrow-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Private conversations</p>
          <h1>Messages</h1>
          <p>Only people who both agreed to connect can message each other.</p>
        </div>
      </header>

      <section className="panel conversation-list">
        {conversations.map((conversation) => {
          const lastMessage =
            conversation.messages[conversation.messages.length - 1];
          return (
            <Link
              className="conversation-row"
              href="/messages/conversation-1"
              key={conversation.id}
            >
              <span className="avatar connection-avatar">
                {conversation.person.slice(0, 2)}
              </span>
              <span className="conversation-copy">
                <strong>{conversation.person}</strong>
                <small>{lastMessage?.body}</small>
              </span>
              {conversation.unread ? (
                <span className="unread-count">{conversation.unread}</span>
              ) : (
                <ArrowRight size={18} aria-hidden="true" />
              )}
            </Link>
          );
        })}
        {conversations.length === 0 ? (
          <div className="empty-state">
            <MessageCircleHeart size={30} aria-hidden="true" />
            <h2>No conversations yet</h2>
            <p>Connect with another caregiver when it feels right.</p>
          </div>
        ) : null}
      </section>

      <div className="privacy-inline">
        <LockKeyhole size={17} aria-hidden="true" />
        <p>
          Private messages are visible only to conversation members. Reported
          messages may be reviewed by an authorized moderator.
        </p>
      </div>
    </div>
  );
}
