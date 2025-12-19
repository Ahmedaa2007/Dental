# SmileCraft Dentistry

SmileCraft Dentistry is a multi-language dental practice platform that combines a modern React front end with a secure, API-driven backend. The system is designed for real-time booking, dynamic pricing with live currency support, and role-aware administration.

## Project Structure
- `frontend/`: React + TypeScript single-page application with Tailwind CSS, Redux Toolkit, React Router v6, Framer Motion, and multilingual support.
- `backend/`: Node.js/Express API with Prisma/PostgreSQL, JWT authentication, and Socket.io for live updates.
- `admin-panel/`: Separate React app for administration, sharing UI primitives with the main frontend where practical.

## Core Features
- Smart booking calendar with capacity-aware day states (blocked, warning, available), animated slot selection, and waitlist handling.
- Real-time currency system with admin-controlled base currency, API-driven exchange rates, and local preference persistence.
- Role-based admin dashboard covering calendar, pricing, communications, and security controls with audit logging.
- Patient portal for appointment history, documents, and treatment plan visualization.
- Accessibility-conscious UI with responsive layouts, reduced-motion mode, and dark/light themes with persisted user preference.

## Technical Highlights
- **Frontend**: Route-based code splitting, Framer Motion micro-interactions, lazy-loaded sections, and global state slices for currency, auth, and bookings.
- **Backend**: Prisma schema for services, pricing history, admin configuration, appointments, users, and audit logs; rate limiting and 2FA support on sensitive routes.
- **Real-Time**: Socket.io channels for booking availability, currency updates, and operational alerts.
- **Security & Reliability**: HTTPS enforcement, SQL injection/XSS protections, session timeout policies, backup and monitoring hooks.

## Next Steps
1. Connect the frontend booking, services, and team views to live API endpoints.
2. Define Prisma schema and Express route skeletons for auth, bookings, pricing, and admin controls.
3. Expand the shared UI component library (cards, forms, modals) and wire Redux Toolkit for currency/auth state.
4. Integrate live exchange rate service with admin override options and local storage preference handling.
5. Add CI workflows for linting, type checking, and automated tests.
