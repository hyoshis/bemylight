"use client";

import { Leaf, RefreshCw, Sparkles } from "lucide-react";
import { useCare } from "@/components/care-provider";

export default function EncouragementPage() {
  const { encouragement, rotateEncouragement } = useCare();

  return (
    <div className="page-stack encouragement-page">
      <header className="page-header centered-header">
        <span className="feature-icon large">
          <Leaf size={25} aria-hidden="true" />
        </span>
        <p className="eyebrow">A quiet moment for you</p>
        <h1>You deserve care, too.</h1>
        <p>
          Take a quiet moment with a reflection chosen to support you today.
        </p>
      </header>

      <article className="large-encouragement-card">
        <Sparkles size={24} aria-hidden="true" />
        <blockquote>“{encouragement.text}”</blockquote>
        {encouragement.attribution ? (
          <cite>— {encouragement.attribution}</cite>
        ) : null}
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
      </article>

      <p className="content-note">
        CareTogether encouragement is reviewed before publication and is never
        presented as medical or therapeutic guidance.
      </p>
    </div>
  );
}
