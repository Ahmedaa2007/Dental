const services = [
  {
    name: "Preventive",
    description: "Cleanings, exams, and fluoride treatments to keep smiles healthy.",
    price: "$120"
  },
  {
    name: "Cosmetic",
    description: "Whitening, veneers, and aligners with transparent, currency-aware pricing.",
    price: "$450"
  },
  {
    name: "Surgical",
    description: "Implants, extractions, and advanced care with live capacity controls.",
    price: "$1,200"
  }
];

export default function ServicesPage() {
  return (
    <section className="panel">
      <h1>Services</h1>
      <p>Explore treatments with quick-book actions and multi-currency pricing.</p>
      <div className="grid">
        {services.map((service) => (
          <div key={service.name} className="card">
            <header className="card-header">
              <h3>{service.name}</h3>
              <span className="pill">{service.price}</span>
            </header>
            <p>{service.description}</p>
            <button className="button ghost">Quick Book</button>
          </div>
        ))}
      </div>
    </section>
  );
}
