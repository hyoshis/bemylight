"use client";

import Link from "next/link";
import { Check, Clock3, MessageCircle, UserRoundPlus } from "lucide-react";
import { useCare } from "@/components/care-provider";

export default function ConnectionsPage() {
  const { connections, requestConnection } = useCare();

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Connection, with consent</p>
          <h1>People you may understand</h1>
          <p>
            Suggestions use only the caregiving topics you chose to share.
            Messages open after both people agree.
          </p>
        </div>
      </header>

      <div className="connection-grid">
        {connections.map((connection) => (
          <article className="connection-card" key={connection.id}>
            <span className="avatar connection-avatar">
              {connection.name.slice(0, 2)}
            </span>
            <div>
              <h2>{connection.name}</h2>
              <p>{connection.summary}</p>
            </div>
            <div className="tag-row">
              {connection.sharedTopics.map((topic) => (
                <span className="soft-tag" key={topic}>
                  {topic}
                </span>
              ))}
            </div>
            {connection.status === "suggested" ? (
              <button
                className="button button-primary button-full"
                type="button"
                onClick={() => requestConnection(connection.id)}
              >
                <UserRoundPlus size={18} aria-hidden="true" />
                Ask to connect
              </button>
            ) : null}
            {connection.status === "pending" ? (
              <button className="button button-quiet button-full" type="button" disabled>
                <Clock3 size={18} aria-hidden="true" />
                Request sent
              </button>
            ) : null}
            {connection.status === "connected" ? (
              <Link
                className="button button-secondary button-full"
                href="/messages/conversation-1"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Continue conversation
              </Link>
            ) : null}
          </article>
        ))}
      </div>

      <section className="safety-panel">
        <Check size={20} aria-hidden="true" />
        <div>
          <h2>You are always in control.</h2>
          <p>
            Decline a request without explanation, end a connection, or block
            someone at any time. Your email and legal name stay private.
          </p>
        </div>
      </section>
    </div>
  );
}
