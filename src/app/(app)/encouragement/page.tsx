"use client";

import { Leaf, RefreshCw, Sparkles } from "lucide-react";
import { useCare } from "@/components/care-provider";
import { getRoleCopy } from "@/lib/demo-data";

export default function EncouragementPage() {
  const { encouragement, settings, rotateEncouragement } = useCare();
  const copy = getRoleCopy(settings.communityRole);

  return (
    <div className="page-stack encouragement-page">
      <header className="page-header centered-header">
        <span className="feature-icon large">
          <Leaf size={25} aria-hidden="true" />
        </span>
        <p className="eyebrow">{copy.encouragementEyebrow}</p>
        <h1>{copy.encouragementTitle}</h1>
        <p>{copy.encouragementLede}</p>
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
        Be My Light encouragement is reviewed before publication and is never
        presented as medical or therapeutic guidance.
      </p>
    </div>
  );
}
