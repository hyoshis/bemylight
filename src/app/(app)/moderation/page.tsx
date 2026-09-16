import { CheckCircle2, Clock3, Flag, ShieldCheck } from "lucide-react";

const reports = [
  {
    id: "R-104",
    target: "Community post",
    reason: "Potential medical advice",
    age: "12 min",
    priority: "Review",
  },
  {
    id: "R-103",
    target: "Private message",
    reason: "Unwanted contact after connection",
    age: "1 hr",
    priority: "Urgent",
  },
];

export default function ModerationPage() {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Protected operations</p>
          <h1>Community care queue</h1>
          <p>
            This preview demonstrates the moderator workflow. Production access
            requires a verified moderator role and creates an audit record.
          </p>
        </div>
        <span className="safety-chip">
          <ShieldCheck size={17} aria-hidden="true" />
          Moderator only
        </span>
      </header>

      <div className="metrics-grid">
        <article>
          <Flag size={20} aria-hidden="true" />
          <strong>2</strong>
          <span>Open reports</span>
        </article>
        <article>
          <Clock3 size={20} aria-hidden="true" />
          <strong>18m</strong>
          <span>Median response</span>
        </article>
        <article>
          <CheckCircle2 size={20} aria-hidden="true" />
          <strong>14</strong>
          <span>Resolved this week</span>
        </article>
      </div>

      <section className="panel">
        <div className="section-heading-row">
          <div>
            <p className="muted-label">Needs attention</p>
            <h2>Open reports</h2>
          </div>
        </div>
        <div className="report-list">
          {reports.map((report) => (
            <article className="report-row" key={report.id}>
              <span className={`priority priority-${report.priority.toLowerCase()}`}>
                {report.priority}
              </span>
              <div>
                <strong>{report.reason}</strong>
                <p>
                  {report.target} · {report.id} · {report.age} ago
                </p>
              </div>
              <button className="button button-secondary button-small" type="button">
                Review
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
