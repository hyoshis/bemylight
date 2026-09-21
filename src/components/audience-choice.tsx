"use client";

import { HeartHandshake, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCare } from "@/components/care-provider";
import type { CommunityRole } from "@/lib/types";

export function AudienceChoice() {
  const router = useRouter();
  const { updateSettings } = useCare();

  function chooseRole(role: CommunityRole) {
    updateSettings({ communityRole: role, topics: [] });
    router.push("/onboarding");
  }

  return (
    <div className="audience-choice">
      <p>How are you joining?</p>
      <div className="audience-choice-grid">
        <button type="button" onClick={() => chooseRole("affected")}>
          <span className="audience-choice-icon">
            <UserRound size={21} aria-hidden="true" />
          </span>
          <span>
            <strong>I&apos;m living with it</strong>
            <small>I&apos;m navigating my own health or disability.</small>
          </span>
        </button>
        <button type="button" onClick={() => chooseRole("caregiver")}>
          <span className="audience-choice-icon">
            <HeartHandshake size={21} aria-hidden="true" />
          </span>
          <span>
            <strong>I support someone</strong>
            <small>I&apos;m a caregiver, family member, or friend.</small>
          </span>
        </button>
      </div>
    </div>
  );
}
