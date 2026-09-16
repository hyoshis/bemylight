"use client";

import { FormEvent, useState } from "react";
import { Bell, Download, RotateCcw, Shield, UserRound } from "lucide-react";
import { useCare } from "@/components/care-provider";
import { careTopics } from "@/lib/demo-data";
import type { EncouragementPreference } from "@/lib/types";

export default function SettingsPage() {
  const { settings, updateSettings, resetPreview } = useCare();
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState(settings.displayName);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSettings({ displayName: displayName.trim() || settings.displayName });
    setSaved(true);
  }

  function toggleTopic(topic: string) {
    const topics = settings.topics.includes(topic)
      ? settings.topics.filter((item) => item !== topic)
      : [...settings.topics, topic];
    updateSettings({ topics });
  }

  return (
    <div className="page-stack narrow-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Your choices</p>
          <h1>Settings & privacy</h1>
          <p>Control what you share and how CareTogether supports you.</p>
        </div>
      </header>

      <section className="settings-section panel">
        <div className="settings-heading">
          <UserRound size={21} aria-hidden="true" />
          <div>
            <h2>Community profile</h2>
            <p>Your email and legal name are never shown publicly.</p>
          </div>
        </div>
        <form className="form-stack" onSubmit={saveProfile}>
          <label>
            CareTogether name
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={40}
            />
          </label>
          <fieldset>
            <legend>Topics I am comfortable sharing</legend>
            <div className="checkbox-grid">
              {careTopics.map((topic) => (
                <label className="check-option" key={topic}>
                  <input
                    type="checkbox"
                    checked={settings.topics.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                  />
                  <span>{topic}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="form-actions">
            <button className="button button-primary" type="submit">
              Save profile
            </button>
            {saved ? <span className="form-success">Saved</span> : null}
          </div>
        </form>
      </section>

      <section className="settings-section panel">
        <div className="settings-heading">
          <Bell size={21} aria-hidden="true" />
          <div>
            <h2>Gentle reminders</h2>
            <p>You can turn reminders off without losing your tasks.</p>
          </div>
        </div>
        <div className="form-stack">
          <label className="toggle-row">
            <span>
              <strong>Email reminders</strong>
              <small>Daily focus and self-kindness prompt</small>
            </span>
            <input
              type="checkbox"
              checked={settings.emailReminders}
              onChange={(event) =>
                updateSettings({ emailReminders: event.target.checked })
              }
            />
          </label>
          <label>
            Delivery time
            <input
              type="time"
              value={settings.dailyReminderTime}
              disabled={!settings.emailReminders}
              onChange={(event) =>
                updateSettings({ dailyReminderTime: event.target.value })
              }
            />
          </label>
          <label>
            Encouragement style
            <select
              value={settings.encouragementPreference}
              onChange={(event) =>
                updateSettings({
                  encouragementPreference: event.target
                    .value as EncouragementPreference,
                })
              }
            >
              <option value="secular">Everyday reflection</option>
              <option value="spiritual">Spiritual, not religious</option>
            </select>
          </label>
        </div>
      </section>

      <section className="settings-section panel">
        <div className="settings-heading">
          <Shield size={21} aria-hidden="true" />
          <div>
            <h2>Privacy & account</h2>
            <p>Production accounts include export and permanent deletion.</p>
          </div>
        </div>
        <div className="settings-actions">
          <button className="button button-secondary" type="button" disabled>
            <Download size={17} aria-hidden="true" />
            Export my data
          </button>
          <button
            className="button button-danger"
            type="button"
            onClick={() => {
              resetPreview();
              setDisplayName("Quiet Lantern");
            }}
          >
            <RotateCcw size={17} aria-hidden="true" />
            Reset private preview
          </button>
        </div>
      </section>
    </div>
  );
}
