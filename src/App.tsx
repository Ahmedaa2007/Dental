import React from 'react';
import {
  Activity,
  AlarmClockCheck,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Globe2,
  Layers,
  Lock,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Webhook,
} from 'lucide-react';

const navLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'pages', label: 'Pages' },
  { id: 'booking', label: 'Booking Engine' },
  { id: 'currency', label: 'Currency' },
  { id: 'admin', label: 'Admin' },
  { id: 'security', label: 'Security' },
  { id: 'experience', label: 'Experience' },
];

const pageCards = [
  {
    title: 'Homepage',
    description: 'Parallax hero, interactive services, live bookings counter, and testimonial carousel.',
  },
  {
    title: 'Services',
    description: 'Preventive, cosmetic, and surgical cards with multi-currency pricing tables and quick-book actions.',
  },
  {
    title: 'Booking System',
    description: 'Smart calendar with hoverable availability insights, animated slot selection, and waitlist mode.',
  },
  {
    title: 'Team',
    description: 'Interactive dentist profiles, live availability badges, and direct-book buttons per clinician.',
  },
  {
    title: 'Patient Portal',
    description: 'Secure login for history, prescriptions, document vault, and treatment plan visualization.',
  },
  {
    title: 'Admin Dashboard',
    description: 'Calendar, pricing, communications, and security modules behind protected routes.',
  },
];

const bookingStatuses = [
  { label: 'Admin blocked / fully booked', color: 'bg-red-500', icon: <Lock className="h-4 w-4" /> },
  { label: 'Warning threshold reached (N)', color: 'bg-orange-400', icon: <AlarmClockCheck className="h-4 w-4" /> },
  { label: 'Approaching capacity', color: 'bg-yellow-300', icon: <Activity className="h-4 w-4 text-slate-900" /> },
  { label: 'Available', color: 'bg-white', icon: <BadgeCheck className="h-4 w-4 text-slate-900" /> },
];

const adminModules = [
  {
    title: 'Calendar Management',
    points: [
      'Color-coded editor with bulk blocking and per-day caps',
      'Set orange threshold (N) and export booking analytics',
      'Drag-and-drop rescheduling with live notifications',
    ],
  },
  {
    title: 'Pricing & Promotions',
    points: [
      'Service price matrix with base + override currencies',
      'Promo scheduler and package builder with audit trail',
      'Historical tracking for compliance and forecasting',
    ],
  },
  {
    title: 'Communication Center',
    points: [
      'Bulk email + SMS templates with appointment variables',
      'Automated reminder cadence and newsletter manager',
      'Feedback collector feeding the satisfaction dashboard',
    ],
  },
  {
    title: 'Security & Roles',
    points: [
      'RBAC (Super Admin, Clinic Manager, Finance, Reception)',
      '2FA, rate limiting, and activity audit logs',
      'Backup controls with recovery drills scheduler',
    ],
  },
];

const bookingFlow = [
  {
    title: 'Patient selects service',
    detail: 'Guided wizard filters by urgency, insurance, and preferred dentist with live price context.',
  },
  {
    title: 'Calendar surfaces best slots',
    detail: 'AI-assisted suggestions weigh chair utilization, provider schedules, and travel buffers.',
  },
  {
    title: 'Confirmation & reminders',
    detail: 'JWT-secured booking receipt, wallet/Apple Pay support, and automated SMS/email cadence.',
  },
  {
    title: 'Admin/Clinician view',
    detail: 'Socket.io pushes updates to receptionist dashboard and clinician mobile views instantly.',
  },
];

const portalFeatures = [
  {
    title: 'Secure patient vault',
    copy: 'Documents, prescriptions, radiographs, and treatment plans stored with expiring links.',
  },
  {
    title: 'Payments & invoices',
    copy: 'Multi-currency ledgers, printable invoices, and BNPL hooks for eligible treatments.',
  },
  {
    title: 'Care timeline',
    copy: 'Milestones for pre-op, day-of, and post-op tasks with reminders and caregiver access.',
  },
];

const experienceHighlights = [
  'AI-powered slot suggestions and virtual consultation queue',
  '360° virtual clinic tour with before/after gallery',
  'Symptom checker and treatment plan generator',
  'One-tap emergency hotline with location hints',
  'Medication tracker for post-procedure care',
];

const securityItems = [
  'HTTPS enforcement with HSTS and secure cookies',
  'SQL injection and XSS protection at API + UI layers',
  'Automatic session timeout and login attempt monitoring',
  'Rate limiting on booking endpoints and admin routes',
  'Routine security audit logs with anomaly detection',
];

const techStack = [
  {
    title: 'Frontend',
    details:
      'React + TypeScript, Tailwind CSS, Framer Motion micro-interactions, Redux Toolkit, React Router v6 with lazy routes.',
    icon: <MonitorSmartphone className="h-10 w-10 text-cyan-300" />,
  },
  {
    title: 'Backend',
    details:
      'Node.js (Express) or FastAPI/Django, PostgreSQL via Prisma ORM, JWT auth, Socket.io for live updates.',
    icon: <Webhook className="h-10 w-10 text-indigo-300" />,
  },
  {
    title: 'Performance',
    details:
      'Redis caching, route-level code splitting, image lazy loading with WebP, CDN-backed asset delivery.',
    icon: <TrendingUp className="h-10 w-10 text-emerald-300" />,
  },
];

const deployment = [
  'GitHub Actions CI/CD with preview deployments',
  'GitHub Pages for frontend, containerized backend services',
  'Environment secrets for API keys and database credentials',
  'Issue templates tailored for patient feedback and ops runbooks',
];

const Pill = ({ label }: { label: string }) => (
  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100 shadow-sm ring-1 ring-white/10">
    {label}
  </span>
);

const Card: React.FC<{ title: string; children: React.ReactNode; accent?: string; id?: string }> = ({
  title,
  children,
  accent = 'from-white/10 via-white/5 to-white/0',
  id,
}) => (
  <div
    id={id}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-xl hover:shadow-cyan-500/10"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70`} />
    <div className="relative p-6 space-y-3">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-cyan-300" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="text-sm text-slate-200 leading-relaxed">{children}</div>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0ea5e9_0%,_transparent_35%),_radial-gradient(circle_at_bottom,_#8b5cf6_0%,_transparent_40%)] opacity-40" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-4 pb-16 pt-8 sm:px-8">
        <header className="sticky top-0 z-20 mb-4 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-4 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-xl font-bold text-slate-900 shadow-lg">
                SC
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">SmileCraft Dentistry</p>
                <p className="text-xs text-slate-300">Full-funnel clinic platform blueprint</p>
              </div>
            </div>
            <nav className="ml-auto hidden items-center gap-2 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="rounded-full px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg shadow-cyan-500/30">
              Launch Booking Demo <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        <section id="overview" className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <Pill label="Full-stack reference" />
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Multi-language dental platform with real-time pricing, smart booking, and admin-grade controls.
            </h1>
            <p className="text-lg text-slate-200">
              SmileCraft Dentistry blends medical-grade reliability with premium patient experience. The blueprint below
              outlines the React + Node/FastAPI stack, live currency engine, Socket.io updates, and security-first
              governance model ready for production.
            </p>
            <div className="flex flex-wrap gap-2">
              {[ 'Multi-currency', 'Real-time booking', 'Socket.io', 'JWT-secured APIs', 'Tailwind + Framer Motion' ].map(
                (label) => (
                  <Pill key={label} label={label} />
                ),
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Live uptime', value: '99.95%', note: 'Health-checked via CI/CD' },
                { title: 'Languages', value: 'EN / ES / AR', note: 'Auto-detect + toggle' },
                { title: 'Currencies', value: 'USD • EUR • EGP', note: 'Admin base + overrides' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">{item.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-cyan-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Smart navigation</p>
                <p className="text-xl font-semibold text-white">Glassmorphism header</p>
              </div>
              <Layers className="h-10 w-10 text-cyan-300" />
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-inner">
              {navLinks.map((link) => (
                <div
                  key={link}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-100"
                >
                  <span>{link}</span>
                  <ArrowRight className="h-4 w-4 text-cyan-200" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 p-3">
                <p className="text-xs text-cyan-100">Active indicator</p>
                <p className="text-lg font-semibold text-white">Smooth transitions</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-3">
                <p className="text-xs text-cyan-100">Mobile</p>
                <p className="text-lg font-semibold text-white">Collapsible menu</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pages" className="grid gap-6 lg:grid-cols-2">
          {techStack.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Architecture</p>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                </div>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{item.details}</p>
              <div className="flex items-center gap-2 text-xs text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                Built-in JWT auth, Socket.io channels, and DX-focused tooling.
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-slate-900 p-6 shadow-xl shadow-cyan-500/10">
            <div className="flex items-center gap-3">
              <Globe2 className="h-10 w-10 text-cyan-200" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-100">Internationalization</p>
                <h3 className="text-xl font-semibold text-white">Languages & Currency</h3>
              </div>
            </div>
            <p className="text-sm text-slate-100">
              Auto-detect locale with manual override, RTL support baked in, and live exchange rates that reprice every
              surface without a refresh. Redux Toolkit stores user preference; admin sets base currency and seasonal
              overrides.
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm text-slate-900">
              {[ 'USD', 'EUR', 'EGP' ].map((currency) => (
                <div key={currency} className="rounded-xl bg-white/90 px-3 py-2 text-center font-semibold shadow">
                  {currency}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6" aria-labelledby="pages-title">
          <div className="flex items-center gap-3">
            <MonitorSmartphone className="h-6 w-6 text-cyan-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Pages</p>
              <h2 id="pages-title" className="text-2xl font-semibold text-white">
                Patient & admin journeys
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pageCards.map((card) => (
              <Card key={card.title} title={card.title}>
                {card.description}
              </Card>
            ))}
          </div>
        </section>

        <section id="booking" className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card title="Dynamic booking engine" accent="from-cyan-500/10 via-white/10 to-indigo-500/10">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/70 p-3">
                <p className="text-xs text-cyan-100">Day status legend</p>
                <div className="space-y-2 text-sm">
                  {bookingStatuses.map((status) => (
                    <div key={status.label} className="flex items-center gap-3">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border border-white/20 ${status.color}`}>
                        {status.icon}
                      </span>
                      <span>{status.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                <div className="flex items-center gap-2 text-cyan-100">
                  <CalendarClock className="h-4 w-4" /> Smart calendar controls
                </div>
                <ul className="list-disc space-y-2 pl-5 text-slate-100">
                  <li>Admin-configurable limits per day and per dentist</li>
                  <li>Hover tooltips with live availability + waitlist opt-in</li>
                  <li>Drag-and-drop rescheduling synced over WebSockets</li>
                  <li>Recurring patterns and automated reminders (SMS/email)</li>
                  <li>Emergency closure mode with bulk notifications</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card id="currency" title="Real-time currency system" accent="from-emerald-400/10 via-white/10 to-cyan-500/10">
            <div className="space-y-3 text-sm text-slate-100">
              <div className="flex items-center gap-2 text-cyan-100">
                <CreditCard className="h-4 w-4" /> Live repricing matrix
              </div>
              <p>
                Base currency set by admin (e.g., USD) with override windows. Prices update instantly across services,
                booking, and portal views using Socket.io channels and persisted preferences.
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-900">
                {[ 'Cleaning', 'Implant', 'Whitening' ].map((service) => (
                  <div key={service} className="rounded-xl bg-white/90 p-2 shadow">
                    <p className="font-semibold">{service}</p>
                    <p className="text-slate-500">USD 120 · EUR 110 · EGP 3700</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-emerald-200">
                <BadgeCheck className="h-4 w-4" /> Manual rate override periods for promotions.
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card title="End-to-end booking playbook" accent="from-cyan-500/10 via-indigo-500/10 to-white/5">
            <div className="space-y-3 text-sm text-slate-100">
              <p className="text-cyan-100">From intent to chair time</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {bookingFlow.map((step) => (
                  <div key={step.title} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs text-slate-300">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Patient portal essentials" accent="from-emerald-400/10 via-white/10 to-indigo-500/10">
            <div className="space-y-3 text-sm text-slate-100">
              <p className="text-cyan-100">Security-first by design</p>
              <div className="space-y-2">
                {portalFeatures.map((feature) => (
                  <div key={feature.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm font-semibold text-white">{feature.title}</p>
                    <p className="text-xs text-slate-200">{feature.copy}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-emerald-200">
                <Lock className="h-4 w-4" />
                OAuth + 2FA enrollment for portal logins with device trust signals.
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-cyan-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Admin Dashboard</p>
              <h2 id="admin" className="text-2xl font-semibold text-white">
                Operational command center
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {adminModules.map((module) => (
              <Card key={module.title} title={module.title}>
                <ul className="list-disc space-y-2 pl-4 text-sm">
                  {module.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <section id="experience" className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card title="Patient experience" accent="from-indigo-500/10 via-white/10 to-cyan-500/10">
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <Pill label="Live wait times" />
                <Pill label="Virtual queue" />
                <Pill label="Before/After slider" />
              </div>
              <ul className="list-disc space-y-2 pl-4 text-slate-100">
                {experienceHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Card>

          <Card id="security" title="Security & reliability" accent="from-red-500/10 via-white/10 to-slate-900">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-cyan-100">
                <ShieldCheck className="h-4 w-4" /> Defense in depth
              </div>
              <ul className="list-disc space-y-2 pl-4 text-slate-100">
                {securityItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-emerald-200">
                <TrendingUp className="h-4 w-4" />
                Observability via real-time dashboards (bookings, revenue, uptime).
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Card title="Deployment & monitoring" accent="from-cyan-500/10 via-indigo-500/10 to-white/5">
            <div className="space-y-2 text-sm">
              <p className="text-cyan-100">GitHub-native delivery</p>
              <ul className="list-disc space-y-2 pl-4 text-slate-100">
                {deployment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Card>
          <Card title="Data schema snapshot" accent="from-emerald-400/10 via-white/10 to-indigo-500/10">
            <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/70 p-4 text-xs font-mono text-emerald-100">
              <p>admin_config</p>
              <pre className="whitespace-pre-wrap text-left text-[11px] text-slate-100">
{`daily_min INT DEFAULT 1
orange_threshold INT DEFAULT 10
blocked_dates JSONB
currency_base VARCHAR(3) DEFAULT 'USD'
`}
              </pre>
              <p>service_pricing</p>
              <pre className="whitespace-pre-wrap text-left text-[11px] text-slate-100">
{`service_id INT
base_price DECIMAL
currency_rates JSONB -- { USD: 100, EGP: 3000 }
effective_date DATE
`}
              </pre>
            </div>
          </Card>
        </section>

        <footer className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-lg">
          <div className="flex flex-wrap justify-center gap-2 text-xs text-cyan-100">
            <Pill label="Role-based access" />
            <Pill label="Socket.io channels" />
            <Pill label="Framer Motion" />
            <Pill label="Prisma + PostgreSQL" />
          </div>
          <h3 className="text-2xl font-semibold text-white">Ready to bring the SmileCraft platform online?</h3>
          <p className="text-sm text-slate-200">
            Deploy the scaffold with Vite + Tailwind, wire in the booking microservice, and connect your currency feed to
            unlock real-time, patient-first dentistry.
          </p>
          <div className="flex justify-center gap-3">
            <button className="rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30">
              Start frontend
            </button>
            <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-300/60">
              Open API docs
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
