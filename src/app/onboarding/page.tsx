"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, HeartHandshake, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCare } from "@/components/care-provider";
import { careTopics } from "@/lib/demo-data";

export default function OnboardingPage() {
  const router = useRouter();
  const { settings, updateSettings } = useCare();
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [topics, setTopics] = useState<string[]>(settings.topics);
  const [agreed, setAgreed] = useState(false);

  function toggleTopic(topic: string) {
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  }

  function finish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed || !displayName.trim() || topics.length === 0) return;
    updateSettings({
      displayName: displayName.trim(),
      topics,
    });
    router.push("/home");
  }

  return (
    <main className="onboarding-shell">
      <LinkBrand />
      <form className="onboarding-card" onSubmit={finish}>
        <div>
          <p className="eyebrow">Welcome to your support circle</p>
          <h1>Let&apos;s make CareTogether feel like yours.</h1>
          <p>
            Share only broad details. You never need to add your loved
            one&apos;s name, diagnosis, or private health information.
          </p>
        </div>

        <label>
          Choose a community ID
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={40}
            required
          />
          <small>This is the only ID other caregivers will see.</small>
        </label>

        <fieldset>
          <legend>What would you like support with?</legend>
          <p className="field-help">Choose at least one. You can change these later.</p>
          <div className="topic-choice-grid">
            {careTopics.map((topic) => {
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
          disabled={!agreed || !displayName.trim() || topics.length === 0}
        >
          Enter CareTogether
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
        <HeartHandshake size={22} aria-hidden="true" />
      </span>
      CareTogether
    </Link>
  );
}
