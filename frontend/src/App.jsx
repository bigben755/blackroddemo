import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { demoApi } from "./demoApi";
import { DemoProvider, useDemo } from "./DemoContext";
import Shell from "./components/Shell";
import Home from "./pages/Home";
import { Events, EventDetail } from "./pages/Events";
import { Organisations, OrganisationDetail } from "./pages/Organisations";
import Feed from "./pages/Feed";
import Venues from "./pages/Venues";
import Volunteering from "./pages/Volunteering";
import { Notifications, SavedEvents } from "./pages/SavedAndNotifications";
import SandboxStudio from "./pages/SandboxStudio";
import { OrganisationDashboard, SiteAdminDemo } from "./pages/ManagementDemo";

export default function App() {
  const [status, setStatus] = React.useState({ loading: true, authenticated: false, configured: true });

  const loadStatus = React.useCallback(async () => {
    try {
      const result = await demoApi.status();
      setStatus({
        loading: false,
        authenticated: Boolean(result.authenticated),
        configured: Boolean(result.password_configured),
      });
    } catch {
      setStatus({ loading: false, authenticated: false, configured: true });
    }
  }, []);

  React.useEffect(() => { loadStatus(); }, [loadStatus]);

  if (status.loading) return <LoadingScreen />;
  if (!status.authenticated) {
    return (
      <PasswordGate
        passwordConfigured={status.configured}
        onAuthenticated={() => setStatus((current) => ({ ...current, authenticated: true }))}
      />
    );
  }

  return (
    <DemoProvider>
      <DemoApplication onLogout={async () => {
        try { await demoApi.logout(); } catch { /* Lock locally even if the backend is unavailable. */ }
        setStatus((current) => ({ ...current, authenticated: false }));
      }} />
    </DemoProvider>
  );
}

function DemoApplication({ onLogout }) {
  const { state } = useDemo();
  if (!state.config.setupComplete) return <SetupWizard />;

  return (
    <Routes>
      <Route element={<Shell onLogout={onLogout} />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/organisations" element={<Organisations />} />
        <Route path="/organisations/:id" element={<OrganisationDetail />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/volunteering" element={<Volunteering />} />
        <Route path="/saved" element={<SavedEvents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/organisation-dashboard" element={<OrganisationDashboard />} />
        <Route path="/site-admin" element={<SiteAdminDemo />} />
        <Route path="/sandbox" element={<SandboxStudio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function PasswordGate({ onAuthenticated, passwordConfigured }) {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await demoApi.login(password);
      onAuthenticated();
    } catch (err) {
      setError(err?.message || "Could not unlock the demo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="gate-page">
      <div className="gate-card">
        <div className="gate-icon"><LockKeyhole size={28} /></div>
        <div className="eyebrow">Private Community Alliance sandbox</div>
        <h1>Explore a local platform safely</h1>
        <p>This demonstration is password protected. Once inside, you can customise the proposed site name and freely explore fictional events, organisations, updates, venues and management tools.</p>

        {!passwordConfigured && (
          <div className="error-box">The owner still needs to set <code>DEMO_ACCESS_PASSWORD</code> in the deployment environment.</div>
        )}

        <form onSubmit={submit} className="gate-form">
          <label className="field">
            <span>Demo password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              autoFocus
              disabled={!passwordConfigured}
            />
          </label>
          {error && <div className="error-box">{error}</div>}
          <button className="button button-primary full-width" type="submit" disabled={busy || !passwordConfigured || !password}>
            {busy ? "Checking…" : "Enter sandbox"} <ArrowRight size={17} />
          </button>
        </form>

        <div className="gate-points">
          <span><ShieldCheck size={16} /> No production Blackrod data</span>
          <span><Sparkles size={16} /> Changes are isolated to your browser</span>
        </div>
      </div>
    </div>
  );
}

function SetupWizard() {
  const { completeSetup } = useDemo();
  const [name, setName] = React.useState("");

  const submit = (event) => {
    event.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    completeSetup(clean);
  };

  return (
    <div className="setup-page">
      <div className="setup-card">
        <div className="setup-step">First-run setup · 1 minute</div>
        <h1>What would you call your local platform?</h1>
        <p>Enter a proposed name. The demo will immediately use it across the homepage and navigation so your group can picture the platform as its own.</p>
        <form onSubmit={submit} className="setup-form">
          <label className="field">
            <span>Proposed platform name</span>
            <input className="input setup-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. My Community Now" autoFocus />
          </label>
          <div className="name-preview">
            <span>Preview</span>
            <strong>{name.trim() || "My Community Now"}</strong>
            <small>What's New. What's On. What's Next.</small>
          </div>
          <button className="button button-primary full-width" type="submit" disabled={!name.trim()}>Build my demo homepage <ArrowRight size={17} /></button>
        </form>
        <p className="setup-note">The name and any changes you make are stored only in this browser. Resetting the sandbox restores fictional starter content.</p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return <div className="loading-page"><div className="loading-dot"></div><span>Loading private sandbox…</span></div>;
}
