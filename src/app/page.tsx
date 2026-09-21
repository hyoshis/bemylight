import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";
import {
  CandleGatheringIllustration,
  CandleMark,
} from "@/components/candle-brand";
import { AudienceChoice } from "@/components/audience-choice";

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <CandleMark />
          </span>
          <span>Be My Light</span>
        </Link>
        <Link className="button button-quiet button-small" href="/home">
          Preview the app
        </Link>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A community that keeps the light on</p>
          <h1>Be a light for someone. Let someone be a light for you.</h1>
          <p className="hero-lede">
            Say what needs to happen and Be My Light turns it into a clear list
            you can keep or hand to someone you trust. Then find people who
            understand the rest of it.
          </p>

          <div className="hero-highlights">
            <article>
              <span className="hero-highlight-icon" aria-hidden="true">
                <Mic size={19} />
              </span>
              <div>
                <strong>Say it, hand it off</strong>
                <p>
                  When asking gets hard, speak your day out loud. AI turns it
                  into a clear list, keeps your details, and you choose what to
                  pass on.
                </p>
              </div>
            </article>
            <article>
              <span className="hero-highlight-icon" aria-hidden="true">
                <MessageCircleHeart size={19} />
              </span>
              <div>
                <strong>Light each other</strong>
                <p>
                  Honest conversations and private connections with people who
                  already understand the hard parts.
                </p>
              </div>
            </article>
          </div>

          <AudienceChoice />
          <div className="hero-actions hero-actions-secondary">
            <Link className="text-link" href="/home">
              Explore Be My Light
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <p className="privacy-note">
            Pseudonymous by default. You choose what to share.
          </p>
        </div>

        <div className="hero-visuals">
          <figure className="hero-candle-card">
            <div className="hero-candle-art">
              <CandleGatheringIllustration viewBox="0 62 560 325" />
            </div>
            <figcaption>
              <p className="muted-label">Light grows when it is shared</p>
              <h2>Together, we shine brighter.</h2>
            </figcaption>
          </figure>

          <div className="hero-task-card">
            <p className="hero-task-voice">
              <span className="hero-task-mic" aria-hidden="true">
                <Mic size={15} />
              </span>
              &ldquo;My prescription needs picking up after four, the pharmacy
              on Oak Street closes at seven. I need a ride Thursday, the
              appointment is at two.&rdquo;
            </p>
            <ul className="hero-task-list">
              <li>
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>
                  Pick up the prescription after 4 PM
                  <small>Oak Street pharmacy, closes at 7.</small>
                </span>
              </li>
              <li>
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>
                  Arrange a ride for Thursday
                  <small>The appointment is at 2 PM.</small>
                </span>
              </li>
            </ul>
            <p className="hero-task-footer">
              Shared with <strong>priyar</strong> · kept by you
            </p>
          </div>
        </div>
      </section>

      <section className="value-grid" aria-label="Be My Light benefits">
        <article>
          <span className="feature-icon">
            <CheckCircle2 size={22} aria-hidden="true" />
          </span>
          <h2>Your list, your control</h2>
          <p>
            Speak or type once. Keep the part that matters to you and pass on
            the rest, one clear step at a time.
          </p>
        </article>
        <article>
          <span className="feature-icon">
            <MessageCircleHeart size={22} aria-hidden="true" />
          </span>
          <h2>People who understand</h2>
          <p>
            Join thoughtful conversations and connect privately with people
            facing similar moments, whether you are living with a condition or
            supporting someone who is.
          </p>
        </article>
        <article>
          <span className="feature-icon">
            <Sparkles size={22} aria-hidden="true" />
          </span>
          <h2>A little care for you</h2>
          <p>
            Receive gentle encouragement on your terms and never with guilt.
          </p>
        </article>
      </section>

      <footer className="landing-footer">
        <p>
          Be My Light offers peer support and organization, not medical or
          emergency care.
        </p>
        <Link href="/community-guidelines">Community guidelines</Link>
      </footer>
    </main>
  );
}
