import Link from "next/link";
import { ArrowLeft, HeartHandshake, ShieldCheck } from "lucide-react";

export default function CommunityGuidelinesPage() {
  return (
    <main className="policy-page">
      <Link className="text-link" href="/">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to CareTogether
      </Link>
      <span className="feature-icon large">
        <ShieldCheck size={25} aria-hidden="true" />
      </span>
      <p className="eyebrow">Community guidelines</p>
      <h1>A space built on care, dignity, and consent.</h1>
      <p className="policy-lede">
        CareTogether is for peer support. Every person here deserves privacy,
        respect, and room to step away.
      </p>
      <section>
        <h2>Support without judgment</h2>
        <p>
          Speak from your own experience. Do not shame someone for how they
          care, feel, grieve, rest, or ask for help.
        </p>
      </section>
      <section>
        <h2>Protect privacy</h2>
        <p>
          Do not share identifying or health information about another person.
          Never repost private conversations outside CareTogether.
        </p>
      </section>
      <section>
        <h2>Do not present advice as professional care</h2>
        <p>
          You may share what helped you, but do not diagnose, prescribe, or
          discourage professional medical, legal, or mental-health support.
        </p>
      </section>
      <section>
        <h2>Respect consent and boundaries</h2>
        <p>
          Private messages require a mutual connection. Stop contact when asked
          and never pressure someone to disclose more.
        </p>
      </section>
      <div className="support-callout">
        <HeartHandshake size={22} aria-hidden="true" />
        <p>
          CareTogether is not an emergency service. If someone may be in
          immediate danger, contact local emergency services or a qualified
          crisis resource.
        </p>
      </div>
    </main>
  );
}
