"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CandleMark } from "@/components/candle-brand";
import { useCare } from "@/components/care-provider";
import { getTopicsForRole } from "@/lib/demo-data";
import type { CommunityRole } from "@/lib/types";

const roleQuotes: Record<
  "affected" | "caregiver" | "undecided",
  { text: string; attribution?: string }
> = {
  affected: {
    text: "What doesn't kill me makes me stronger.",
    attribution: "Friedrich Nietzsche",
  },
  caregiver: {
    text: "May you feel held by something larger than this difficult moment.",
  },
  undecided: {
    text: "A candle loses nothing by lighting another candle.",
    attribution: "Traditional proverb",
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { settings, updateSettings } = useCare();
  const [displayName, setDisplayName] = useState("");
  const [communityRole, setCommunityRole] = useState<CommunityRole | null>(
    settings.communityRole,
  );
  const [topics, setTopics] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const topicOptions = getTopicsForRole(communityRole);
  const quote = roleQuotes[communityRole ?? "undecided"];

  useEffect(() => {
    if (settings.communityRole && communityRole === null) {
      setCommunityRole(settings.communityRole);
    }
  }, [settings.communityRole, communityRole]);

  function toggleTopic(topic: string) {
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  }

  function finish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed || !communityRole || !displayName.trim() || topics.length === 0)
      return;
    updateSettings({
      displayName: displayName.trim(),
      communityRole,
      topics,
    });
    router.push("/home");
  }

  return (
    <main className="onboarding-shell">
      <LinkBrand />
      <form className="onboarding-card" onSubmit={finish}>
        <figure className="onboarding-quote">
          <span className="onboarding-quote-mark" aria-hidden="true">
            <CandleMark />
          </span>
          <blockquote>&ldquo;{quote.text}&rdquo;</blockquote>
          {quote.attribution ? (
            <figcaption>— {quote.attribution}</figcaption>
          ) : null}
        </figure>

        <div>
          <p className="eyebrow">Welcome to your support circle</p>
          <h1>Let&apos;s make Be My Light feel like yours.</h1>
          <p>
            {communityRole === "affected"
              ? "Share only broad details. You never need to add your diagnosis, medical records, or anything you would rather keep private."
              : "Share only broad details. You never need to add your loved one's name, diagnosis, or private health information."}
          </p>
        </div>

        <fieldset>
          <legend>Which perspective fits you?</legend>
          <div className="radio-card-grid">
            <label>
              <input
                type="radio"
                name="community-role"
                checked={communityRole === "affected"}
                onChange={() => {
                  setCommunityRole("affected");
                  setTopics([]);
                }}
              />
              <span>
                <strong>I&apos;m living with it</strong>
                <small>I&apos;m navigating my own health or disability.</small>
              </span>
            </label>
            <label>
              <input
                type="radio"
                name="community-role"
                checked={communityRole === "caregiver"}
                onChange={() => {
                  setCommunityRole("caregiver");
                  setTopics([]);
                }}
              />
              <span>
                <strong>I support someone</strong>
                <small>I&apos;m a caregiver, family member, or friend.</small>
              </span>
            </label>
          </div>
        </fieldset>

        <label>
          Choose a community ID
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={40}
            required
          />
          <small>This is the only ID other community members will see.</small>
        </label>

        <fieldset>
          <legend>What would you like support with?</legend>
          <p className="field-help">Choose at least one. You can change these later.</p>
          <div className="topic-choice-grid">
            {topicOptions.map((topic) => {
              const selected = topics.includes(topic);
              return (
                <label className={selected ? "is-selected" : ""} key={topic}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleTopic(topic)}
                  />
                  <span>{selected ? <Check size={16} /> : null}</span>
                  {topic}
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="guideline-check">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
          <ShieldCheck size={20} aria-hidden="true" />
          <span>
            I will protect privacy, offer support without judgment, and avoid
            presenting medical advice as fact.
          </span>
        </label>

        <button
          className="button button-primary button-full"
          type="submit"
          disabled={
            !agreed ||
            !communityRole ||
            !displayName.trim() ||
            topics.length === 0
          }
        >
          Enter Be My Light
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </main>
  );
}

function LinkBrand() {
  return (
    <Link className="brand" href="/">
      <span className="brand-mark">
        <CandleMark aria-hidden="true" />
      </span>
      Be My Light
    </Link>
  );
}
