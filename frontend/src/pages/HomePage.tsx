export default function HomePage() {
  return (
    <section className="panel">
      <h1>SmileCraft Dentistry</h1>
      <p>
        A modern, multi-language dental platform featuring real-time booking, live currency-aware
        pricing, and a patient-first experience.
      </p>
      <div className="grid">
        <div className="card">
          <h3>Dynamic Booking</h3>
          <p>Smart calendar logic highlights capacity, waitlists, and admin blocks at a glance.</p>
        </div>
        <div className="card">
          <h3>Real-Time Pricing</h3>
          <p>Prices update instantly across supported currencies with admin overrides.</p>
        </div>
        <div className="card">
          <h3>Secure Portal</h3>
          <p>Patients access appointments, prescriptions, and treatment plans in one place.</p>
        </div>
      </div>
    </section>
  );
}
