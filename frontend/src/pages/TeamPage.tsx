const team = [
  { name: "Dr. Nova Lee", status: "Available" },
  { name: "Dr. Samir Patel", status: "In Surgery" },
  { name: "Dr. Claire Young", status: "Consulting" }
];

export default function TeamPage() {
  return (
    <section className="panel">
      <h1>Meet the Team</h1>
      <p>Interactive staff cards show live availability and direct booking entry points.</p>
      <div className="grid">
        {team.map((member) => (
          <div key={member.name} className="card">
            <h3>{member.name}</h3>
            <p className="status">Status: {member.status}</p>
            <button className="button ghost">Book with {member.name.split(" ")[1]}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
