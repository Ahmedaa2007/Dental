import { useTheme } from "@smilecraft/theme";

const sections = [
  {
    title: "Calendar Management",
    description: "Bulk-block holidays, set per-day capacity, and adjust warning thresholds."
  },
  {
    title: "Pricing Management",
    description: "Edit multi-currency matrices, schedule promos, and track historical prices."
  },
  {
    title: "Communication Center",
    description: "Send reminders, newsletters, and bulk updates to patients at once."
  },
  {
    title: "Security",
    description: "Manage roles, audit activity, and enforce two-factor authentication."
  }
];

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>SmileCraft Control Center</h1>
          <p className="muted">Session theme is stored per user and restored automatically.</p>
        </div>
        <button className="button" onClick={toggleTheme} aria-label="Toggle color mode">
          {theme === "light" ? "Switch to dark" : "Switch to light"}
        </button>
      </header>

      <div className="cards">
        {sections.map((section) => (
          <article key={section.title} className="card">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
