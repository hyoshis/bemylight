"use client";

import { Heart, Leaf, RefreshCw, Sparkles } from "lucide-react";
import { useCare } from "@/components/care-provider";
import type { EncouragementPreference } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function EncouragementPage() {
  const {
    encouragement,
    settings,
    updateSettings,
    rotateEncouragement,
  } = useCare();

  function choosePreference(preference: EncouragementPreference) {
    updateSettings({ encouragementPreference: preference });
    window.setTimeout(rotateEncouragement, 0);
  }

  return (
    <div className="page-stack encouragement-page">
      <header className="page-header centered-header">
        <span className="feature-icon large">
          <Leaf size={25} aria-hidden="true" />
        </span>
        <p className="eyebrow">A quiet moment for you</p>
        <h1>You deserve care, too.</h1>
        <p>
          Choose the kind of encouragement that feels grounding today. You can
          change this at any time.
        </p>
      </header>

      <div className="segmented-control" aria-label="Encouragement preference">
        {(["secular", "spiritual"] as const).map((preference) => (
          <button
            type="button"
            key={preference}
            className={cn(
              settings.encouragementPreference === preference && "is-active",
            )}
            aria-pressed={
              settings.encouragementPreference === preference
            }
            onClick={() => choosePreference(preference)}
          >
            {preference === "secular" ? "Everyday reflection" : "Spiritual"}
          </button>
        ))}
      </div>

      <article className="large-encouragement-card">
        <Sparkles size={24} aria-hidden="true" />
        <blockquote>“{encouragement.text}”</blockquote>
        {encouragement.attribution ? (
          <cite>— {encouragement.attribution}</cite>
        ) : (
          <span className="reviewed-label">CareTogether reflection</span>
        )}
        <div className="reflection-prompt">
          <Heart size={18} aria-hidden="true" />
          <p>{encouragement.prompt}</p>
        </div>
        <button
          className="button button-secondary"
          type="button"
          onClick={rotateEncouragement}
        >
          <RefreshCw size={17} aria-hidden="true" />
          Show another
        </button>
      </article>

      <p className="content-note">
        CareTogether encouragement is reviewed before publication and is never
        presented as medical, therapeutic, or religious authority.
      </p>
    </div>
  );
}
