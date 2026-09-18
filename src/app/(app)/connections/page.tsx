"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  LoaderCircle,
  MapPin,
  MessageCircle,
  UserRoundPlus,
} from "lucide-react";
import { useCare } from "@/components/care-provider";
import { cn } from "@/lib/utils";

export default function ConnectionsPage() {
  const { connections, settings, requestConnection, updateSettings } = useCare();
  const connectionLocation = settings.connectionLocation ?? "everywhere";
  const connectionZipCode = settings.connectionZipCode ?? "";
  const [displayMode, setDisplayMode] = useState<"everywhere" | "zipcode">(
    connectionLocation === "zipcode" && connectionZipCode.length === 5
      ? "zipcode"
      : "everywhere",
  );
  const [displayZip, setDisplayZip] = useState(
    connectionZipCode.length === 5 ? connectionZipCode : "",
  );
  const [refreshing, setRefreshing] = useState(false);
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);

  useEffect(() => {
    const ready =
      connectionLocation === "everywhere" || connectionZipCode.length === 5;

    if (!ready) return;

    setRefreshing(true);
    const timeout = window.setTimeout(() => {
      setDisplayMode(connectionLocation);
      setDisplayZip(connectionLocation === "zipcode" ? connectionZipCode : "");
      setExpandedProfileId(null);
      setRefreshing(false);
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [connectionLocation, connectionZipCode]);

  const nearbyConnections = useMemo(() => {
    const offset = displayZip
      .split("")
      .reduce((total, digit) => total + Number(digit), 0) % connections.length;

    return Array.from(
      { length: Math.min(6, connections.length) },
      (_, index) => connections[(offset + index) % connections.length],
    );
  }, [connections, displayZip]);

  const visibleConnections =
    displayMode === "zipcode"
      ? nearbyConnections
      : connections.slice(0, 20);

  function updateZipCode(value: string) {
    updateSettings({
      connectionLocation: "zipcode",
      connectionZipCode: value.replace(/\D/g, "").slice(0, 5),
    });
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Connection, with consent</p>
          <h1>People you may understand</h1>
          <p>
            Suggestions use the caregiving topics and location preference you
            choose to share. Messages open after both people agree.
          </p>
        </div>
      </header>

      <section className="panel connection-location-panel">
        <div className="connection-location-heading">
          <MapPin size={21} aria-hidden="true" />
          <div>
            <h2>Where should we look?</h2>
            <p>Choose nearby connections or include people everywhere.</p>
          </div>
        </div>
        <div
          className="location-choice"
          role="radiogroup"
          aria-label="Connection location"
        >
          <label className="location-option">
            <input
              type="radio"
              name="connection-location"
              value="everywhere"
              checked={connectionLocation === "everywhere"}
              onChange={() =>
                updateSettings({ connectionLocation: "everywhere" })
              }
            />
            <Globe2 size={18} aria-hidden="true" />
            Everywhere
          </label>
          <div
            className={cn(
              "location-option",
              "near-zip-option",
              connectionLocation === "zipcode" && "is-selected",
            )}
          >
            <label>
              <input
                type="radio"
                name="connection-location"
                value="zipcode"
                checked={connectionLocation === "zipcode"}
                onChange={() =>
                  updateSettings({ connectionLocation: "zipcode" })
                }
              />
              <MapPin size={18} aria-hidden="true" />
              Near ZIP code
            </label>
            <input
              className="inline-zip-input"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              aria-label="ZIP code"
              maxLength={5}
              placeholder="ZIP code"
              value={connectionZipCode}
              onFocus={() =>
                updateSettings({ connectionLocation: "zipcode" })
              }
              onChange={(event) => updateZipCode(event.target.value)}
            />
          </div>
        </div>
        <p className="location-status">
          {connectionLocation === "zipcode" && connectionZipCode.length < 5
            ? "Enter a five-digit ZIP code to narrow the list."
            : displayMode === "zipcode"
              ? `Showing people near ${displayZip}.`
              : "Showing people everywhere."}
        </p>
      </section>

      <section
        className="connection-results"
        aria-live="polite"
        aria-busy={refreshing}
      >
        <div className="section-heading-row">
          <div>
            <p className="muted-label">
              {displayMode === "zipcode" ? "Nearby" : "Everywhere"}
            </p>
            <h2>
              {visibleConnections.length}{" "}
              {visibleConnections.length === 1 ? "person" : "people"}
            </h2>
          </div>
        </div>

        {refreshing ? (
          <div className="refresh-state">
            <LoaderCircle className="refresh-spinner" size={26} aria-hidden="true" />
            <strong>Refreshing matches...</strong>
            <span>Looking for people who fit your preferences.</span>
          </div>
        ) : (
          <div className="connection-grid">
            {visibleConnections.map((connection) => {
              const expanded = expandedProfileId === connection.id;

              return (
                <article
                  className={cn("connection-card", expanded && "is-expanded")}
                  key={connection.id}
                >
                  <div className="connection-card-main">
                    <button
                      className="connection-profile-toggle"
                      type="button"
                      aria-expanded={expanded}
                      onClick={() =>
                        setExpandedProfileId(expanded ? null : connection.id)
                      }
                    >
                      <span className="avatar connection-avatar">
                        {connection.name.slice(0, 2)}
                      </span>
                      <span className="connection-profile-copy">
                        <strong>{connection.name}</strong>
                        <span>{connection.summary}</span>
                        <span className="tag-row">
                          {connection.sharedTopics.map((topic) => (
                            <span className="soft-tag" key={topic}>
                              {topic}
                            </span>
                          ))}
                        </span>
                      </span>
                      <ChevronDown
                        className={cn("profile-chevron", expanded && "is-open")}
                        size={20}
                        aria-hidden="true"
                      />
                    </button>

                    <div className="connection-card-action">
                      {connection.status === "suggested" ? (
                        <button
                          className="button button-primary button-small"
                          type="button"
                          onClick={() => requestConnection(connection.id)}
                        >
                          <UserRoundPlus size={17} aria-hidden="true" />
                          Ask to connect
                        </button>
                      ) : null}
                      {connection.status === "pending" ? (
                        <button
                          className="button button-quiet button-small"
                          type="button"
                          disabled
                        >
                          <Clock3 size={17} aria-hidden="true" />
                          Request sent
                        </button>
                      ) : null}
                      {connection.status === "connected" ? (
                        <Link
                          className="button button-secondary button-small"
                          href="/messages/conversation-1"
                        >
                          <MessageCircle size={17} aria-hidden="true" />
                          Message
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  {expanded ? (
                    <div className="connection-details">
                      <section>
                        <p className="muted-label">Self introduction</p>
                        <p>{connection.introduction}</p>
                      </section>
                      <section>
                        <p className="muted-label">Interests</p>
                        <div className="tag-row">
                          {connection.interests.map((interest) => (
                            <span className="interest-tag" key={interest}>
                              {interest}
                            </span>
                          ))}
                        </div>
                      </section>
                      <section>
                        <p className="muted-label">Posts so far</p>
                        <div className="profile-post-list">
                          {connection.recentPosts.map((post) => (
                            <article className="profile-post" key={post.id}>
                              <div>
                                <strong>{post.topic}</strong>
                                <span>{post.createdAt}</span>
                              </div>
                              <p>{post.body}</p>
                            </article>
                          ))}
                        </div>
                      </section>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>

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
