import { Link, NavLink, Route, Routes } from "react-router-dom";
import { useTheme } from "@smilecraft/theme";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import BookingPage from "./pages/BookingPage";
import TeamPage from "./pages/TeamPage";
import AdminPage from "./pages/AdminPage";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="button" onClick={toggleTheme} aria-label="Toggle color mode">
      {theme === "light" ? "🌞 Light" : "🌚 Dark"}
    </button>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <Link to="/" className="brand">
          SmileCraft Dentistry
        </Link>
        <nav className="nav">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/booking" className={navLinkClass}>
            Booking
          </NavLink>
          <NavLink to="/team" className={navLinkClass}>
            Team
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <footer className="footer">Smiles crafted with care — theme preference saved automatically.</footer>
    </div>
  );
}
