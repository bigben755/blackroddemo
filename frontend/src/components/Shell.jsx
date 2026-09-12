import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  CalendarDays,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Newspaper,
  RotateCcw,
  X,
} from "lucide-react";
import { useDemo } from "../DemoContext";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/organisations", label: "Organisations", icon: Building2 },
  { to: "/feed", label: "Local feed", icon: Newspaper },
  { to: "/venues", label: "Venues", icon: MapPin },
  { to: "/volunteering", label: "Volunteering", icon: Heart },
  { to: "/sandbox", label: "Sandbox Studio", icon: LayoutDashboard },
];

export default function Shell({ onLogout }) {
  const { state, resetDemo, startOver } = useDemo();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const unread = (state.notifications || []).filter((item) => !item.read).length;

  const confirmReset = () => {
    if (!window.confirm("Reset this browser's sandbox back to the fictional starter content?")) return;
    resetDemo();
    navigate("/");
  };

  const confirmSetupRestart = () => {
    if (!window.confirm("Start the setup again? This also restores the fictional starter data in this browser.")) return;
    startOver();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <div className="demo-ribbon">
        <span><strong>Sandbox demo</strong> · all organisations, events and contact details are fictional</span>
        <span>Changes stay in this browser only</span>
      </div>

      <header className="site-header">
        <div className="site-header-inner">
          <NavLink to="/" className="brand-lockup" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">CA</span>
            <span>
              <span className="brand-name">{state.config.siteName}</span>
              <span className="brand-tagline">{state.config.tagline}</span>
            </span>
          </NavLink>

          <nav className="desktop-nav" aria-label="Main navigation">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end={to === "/"}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <NavLink to="/saved" className="icon-button" title="Saved events" aria-label="Saved events">
              <Heart size={18} />
              {state.savedEventIds.length > 0 && <span className="count-badge">{state.savedEventIds.length}</span>}
            </NavLink>
            <NavLink to="/notifications" className="icon-button" title="Notifications" aria-label="Notifications">
              <Bell size={18} />
              {unread > 0 && <span className="count-badge">{unread}</span>}
            </NavLink>
            <button className="mobile-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-nav">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`} end={to === "/"}>
                <Icon size={17} /> {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">{state.config.siteName}</div>
            <p>A private sandbox for Community Alliance members to explore a Blackrod Now-style local platform.</p>
          </div>
          <div>
            <div className="footer-heading">Demo controls</div>
            <button onClick={confirmReset} className="footer-action"><RotateCcw size={15} /> Reset fictional data</button>
            <button onClick={confirmSetupRestart} className="footer-action"><LayoutDashboard size={15} /> Run setup again</button>
          </div>
          <div>
            <div className="footer-heading">Access</div>
            <button onClick={onLogout} className="footer-action"><LogOut size={15} /> Lock demo</button>
            <p className="footer-small">Nothing entered here is sent to Blackrod Now.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
