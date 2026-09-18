import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <HeartHandshake size={22} strokeWidth={1.8} />
          </span>
          <span>CareTogether</span>
        </Link>
        <Link className="button button-quiet button-small" href="/home">
          Preview the app
        </Link>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Care for them. Support for you.</p>
          <h1>You do not have to carry caregiving alone.</h1>
          <p className="hero-lede">
            CareTogether helps family caregivers find people who understand,
            focus on the next small step, and make room for their own wellbeing.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/onboarding">
              Find your support circle
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="text-link" href="/home">
              Explore CareTogether
            </Link>
          </div>
          <p className="privacy-note">
            Pseudonymous by default. You choose what to share.
          </p>
        </div>

        <div className="hero-card" aria-label="CareTogether daily preview">
          <div className="hero-card-top">
            <div>
              <p className="muted-label">Thursday, September 17</p>
              <h2>Good evening, hiyoglow.</h2>
            </div>
            <span className="soft-orb" aria-hidden="true" />
          </div>
          <div className="quote-card">
            <Sparkles size={18} aria-hidden="true" />
            <p>
              You are allowed to take this one gentle step at a time.
            </p>
          </div>
          <div className="mini-section">
            <div className="section-heading-row">
              <div>
                <p className="muted-label">What matters now</p>
                <h3>Your focus steps</h3>
              </div>
              <span className="progress-pill">1 complete</span>
            </div>
            <ul className="preview-tasks">
              <li className="is-done">
                <CheckCircle2 size={20} aria-hidden="true" />
                Confirm Thursday&apos;s appointment
              </li>
              <li>
                <span className="empty-check" aria-hidden="true" />
                Refill the weekly pill organizer
              </li>
              <li>
                <span className="empty-check" aria-hidden="true" />
                Take a ten-minute walk
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="value-grid" aria-label="CareTogether benefits">
        <article>
          <span className="feature-icon">
            <MessageCircleHeart size={22} aria-hidden="true" />
          </span>
          <h2>People who understand</h2>
          <p>
            Join thoughtful conversations and connect privately with caregivers
            facing similar moments.
          </p>
        </article>
        <article>
          <span className="feature-icon">
            <CheckCircle2 size={22} aria-hidden="true" />
          </span>
          <h2>One step at a time</h2>
          <p>
            Turn an overwhelming list into the actions you choose to focus on
            today.
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
          CareTogether offers peer support and organization, not medical or
          emergency care.
        </p>
        <Link href="/community-guidelines">Community guidelines</Link>
      </footer>
    </main>
  );
}
