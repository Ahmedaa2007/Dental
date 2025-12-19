const availabilityLegend = [
  { color: "red", label: "Blocked / Full" },
  { color: "orange", label: "High volume (>= N)" },
  { color: "yellow", label: "Approaching capacity" },
  { color: "white", label: "Available" }
];

export default function BookingPage() {
  return (
    <section className="panel">
      <h1>Smart Booking</h1>
      <p>
        The interactive calendar uses admin-defined limits to color-code days, surfaces waitlists, and
        highlights live availability.
      </p>
      <div className="legend">
        {availabilityLegend.map((item) => (
          <div key={item.color} className={`legend-item ${item.color}`}>
            <span className="swatch" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="calendar-placeholder">
        <div className="calendar-heading">Live Calendar (demo)</div>
        <p>Day-level caps, slot animations, and drag-and-drop rescheduling land here.</p>
      </div>
    </section>
  );
}
