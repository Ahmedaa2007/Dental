export default function AdminPage() {
  return (
    <section className="panel">
      <h1>Admin Dashboard</h1>
      <p>
        Role-based controls power calendar limits, promotional pricing schedules, and communication
        tools.
      </p>
      <div className="grid">
        <div className="card">
          <h3>Calendar Controls</h3>
          <p>Configure blocked dates, warning thresholds, and daily capacity limits.</p>
        </div>
        <div className="card">
          <h3>Pricing Manager</h3>
          <p>Manage base currency, overrides, and live rate updates across services.</p>
        </div>
        <div className="card">
          <h3>Security</h3>
          <p>Two-factor auth, audit logs, and automatic session timeout keep data safe.</p>
        </div>
      </div>
    </section>
  );
}
