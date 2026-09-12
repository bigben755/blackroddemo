import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Mail,
  MessageSquare,
  Newspaper,
  Plus,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useDemo } from "../DemoContext";

const asLocalInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};

const isoFromLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

const relativeDate = (value) => {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

export function OrganisationDashboard() {
  const { state, updateOrganisation, addFeedPost, addEvent } = useDemo();
  const defaultOrg = state.organisations.find((org) => org.claimed) || state.organisations[0];
  const [selectedId, setSelectedId] = React.useState(defaultOrg?.id || "");
  const selected = state.organisations.find((org) => org.id === selectedId) || state.organisations[0];
  const [profile, setProfile] = React.useState({ name: "", short: "", email: "", phone: "", website: "" });
  const [post, setPost] = React.useState({ title: "", body: "" });
  const [eventForm, setEventForm] = React.useState({ title: "", start: "", venueId: state.venues[0]?.id || "" });
  const [notice, setNotice] = React.useState("");

  React.useEffect(() => {
    if (!selected) return;
    setProfile({
      name: selected.name || "",
      short: selected.short || "",
      email: selected.email || "",
      phone: selected.phone || "",
      website: selected.website || "",
    });
  }, [selected]);

  if (!selected) return <div className="page-container section">No fictional organisations are available.</div>;

  const events = state.events.filter((event) => event.orgId === selected.id);
  const posts = state.feed.filter((item) => item.orgId === selected.id);
  const volunteering = state.volunteering.filter((item) => item.orgId === selected.id);

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    updateOrganisation(selected.id, profile);
    flash("Organisation profile updated in this browser.");
  };

  const publishPost = (event) => {
    event.preventDefault();
    if (!post.title.trim() || !post.body.trim()) return;
    addFeedPost({ orgId: selected.id, title: post.title.trim(), body: post.body.trim() });
    setPost({ title: "", body: "" });
    flash("Demo community update published.");
  };

  const publishEvent = (event) => {
    event.preventDefault();
    const start = isoFromLocal(eventForm.start);
    if (!eventForm.title.trim() || !start) return;
    const end = new Date(new Date(start).getTime() + 2 * 60 * 60 * 1000).toISOString();
    addEvent({
      title: eventForm.title.trim(),
      orgId: selected.id,
      venueId: eventForm.venueId,
      start,
      end,
      category: selected.category || "Community",
      fee: "Free",
      description: "A fictional event created from the organisation dashboard demonstration.",
    });
    setEventForm({ title: "", start: "", venueId: state.venues[0]?.id || "" });
    flash("Demo event published.");
  };

  return (
    <section className="page-container section page-top management-page">
      <ManagementHeading
        eyebrow="Organisation experience"
        title="Organisation dashboard"
        text="Explore the self-service view a local group could use to maintain its profile, publish events and post updates. Everything remains fictional and browser-only."
        icon={Building2}
      />

      {notice && <div className="management-toast"><CheckCircle2 size={16} /> {notice}</div>}

      <div className="management-toolbar">
        <label className="management-select-wrap">
          <span>Act as organisation</span>
          <select value={selected.id} onChange={(event) => setSelectedId(event.target.value)}>
            {state.organisations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
          </select>
        </label>
        <div className="demo-mode-note"><ShieldCheck size={16} /> No separate login is required in the sandbox.</div>
      </div>

      <div className="management-metrics">
        <Metric icon={CalendarDays} value={events.length} label="Events" />
        <Metric icon={Newspaper} value={posts.length} label="Updates" />
        <Metric icon={Users} value={volunteering.length} label="Volunteer roles" />
        <Metric icon={BadgeCheck} value={selected.claimed ? "Claimed" : "Unclaimed"} label="Profile status" />
      </div>

      <div className="management-grid two-col">
        <div className="management-card">
          <CardTitle icon={Building2} title="Edit organisation profile" text="Changes appear immediately on the public organisation page." />
          <form className="management-form" onSubmit={saveProfile}>
            <Field label="Organisation name" value={profile.name} onChange={(value) => setProfile((current) => ({ ...current, name: value }))} />
            <Field label="Short description" value={profile.short} onChange={(value) => setProfile((current) => ({ ...current, short: value }))} multiline />
            <div className="management-form-grid">
              <Field label="Email" value={profile.email} onChange={(value) => setProfile((current) => ({ ...current, email: value }))} />
              <Field label="Phone" value={profile.phone} onChange={(value) => setProfile((current) => ({ ...current, phone: value }))} />
            </div>
            <Field label="Website" value={profile.website} onChange={(value) => setProfile((current) => ({ ...current, website: value }))} />
            <button className="button button-primary" type="submit"><Save size={16} /> Save profile</button>
          </form>
        </div>

        <div className="management-card">
          <CardTitle icon={Newspaper} title="Publish a local update" text="This feeds straight into the fictional What's New stream." />
          <form className="management-form" onSubmit={publishPost}>
            <Field label="Update title" value={post.title} onChange={(value) => setPost((current) => ({ ...current, title: value }))} placeholder="e.g. Volunteers needed this weekend" />
            <Field label="Update" value={post.body} onChange={(value) => setPost((current) => ({ ...current, body: value }))} multiline placeholder="Write a short fictional update…" />
            <button className="button button-primary" type="submit" disabled={!post.title.trim() || !post.body.trim()}><Send size={16} /> Publish update</button>
          </form>
          <div className="management-list compact-list">
            {posts.slice(0, 3).map((item) => <div key={item.id}><strong>{item.title}</strong><span>{relativeDate(item.createdAt)}</span></div>)}
            {!posts.length && <div className="muted">No updates from this organisation yet.</div>}
          </div>
        </div>
      </div>

      <div className="management-card management-wide-card">
        <CardTitle icon={CalendarDays} title="Create an event" text="A short organisation-side workflow showing how local groups can maintain What's On without site-admin intervention." />
        <form className="management-inline-form" onSubmit={publishEvent}>
          <label><span>Event title</span><input value={eventForm.title} onChange={(e) => setEventForm((c) => ({ ...c, title: e.target.value }))} placeholder="Fictional event title" /></label>
          <label><span>Date & time</span><input type="datetime-local" value={eventForm.start} onChange={(e) => setEventForm((c) => ({ ...c, start: e.target.value }))} /></label>
          <label><span>Venue</span><select value={eventForm.venueId} onChange={(e) => setEventForm((c) => ({ ...c, venueId: e.target.value }))}>{state.venues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}</select></label>
          <button className="button button-primary" type="submit" disabled={!eventForm.title.trim() || !eventForm.start}><Plus size={16} /> Publish demo event</button>
        </form>
        <div className="management-table-wrap">
          <table className="management-table">
            <thead><tr><th>Event</th><th>Starts</th><th>Status</th><th></th></tr></thead>
            <tbody>{events.map((item) => <tr key={item.id}><td>{item.title}</td><td>{new Date(item.start).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td><td><StatusPill label={item.status} /></td><td><Link to={`/events/${item.id}`} className="text-link">View →</Link></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const ADMIN_TABS = ["control", "content", "organisations", "messages", "claims", "accuracy"];

export function SiteAdminDemo() {
  const { state, updateOrganisation, updateEvent } = useDemo();
  const [tab, setTab] = React.useState("control");
  const [checks, setChecks] = React.useState({});
  const [messages, setMessages] = React.useState([
    { id: "msg-1", from: "resident@example.invalid", subject: "Question about a sample event", read: false },
    { id: "msg-2", from: "group@example.invalid", subject: "Please update our fictional listing", read: true },
  ]);
  const [compose, setCompose] = React.useState({ to: "all organisations", subject: "", body: "" });
  const [notice, setNotice] = React.useState("");

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const published = state.events.filter((event) => event.status === "published");
  const unclaimed = state.organisations.filter((org) => !org.claimed);
  const withoutAdmins = state.organisations.filter((org) => !(org.admins || []).length);
  const unread = messages.filter((message) => !message.read).length;

  const simulateCheck = (event) => {
    const verdict = Object.keys(checks).length % 3 === 2 ? "Review suggested" : "Looks accurate";
    setChecks((current) => ({ ...current, [event.id]: verdict }));
    flash(`Simulated source check complete: ${verdict}.`);
  };

  const approveClaim = (org) => {
    updateOrganisation(org.id, { claimed: true, admins: [`admin@${org.id}.example.invalid`] });
    flash(`Demo claim approved for ${org.name}.`);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (!compose.subject.trim() || !compose.body.trim()) return;
    flash(`Simulated message sent to ${compose.to}. No email left this browser.`);
    setCompose((current) => ({ ...current, subject: "", body: "" }));
  };

  return (
    <section className="page-container section page-top management-page">
      <ManagementHeading
        eyebrow="Alliance administration"
        title="Site admin preview"
        text="A compact sandbox version of the operational workspace: content, organisation access, claims, messages and credibility checks without any production integrations."
        icon={ShieldCheck}
      />

      {notice && <div className="management-toast"><CheckCircle2 size={16} /> {notice}</div>}

      <div className="admin-tabbar">
        {ADMIN_TABS.map((key) => <button key={key} onClick={() => setTab(key)} className={tab === key ? "active" : ""}>{key}</button>)}
      </div>

      {tab === "control" && (
        <>
          <div className="management-metrics">
            <Metric icon={CalendarDays} value={published.length} label="Published events" />
            <Metric icon={Building2} value={state.organisations.length} label="Organisations" />
            <Metric icon={AlertTriangle} value={withoutAdmins.length} label="Without admins" />
            <Metric icon={Mail} value={unread} label="Unread messages" />
          </div>
          <div className="management-grid two-col">
            <div className="management-card">
              <CardTitle icon={Activity} title="What needs attention?" text="Representative examples of the work an Alliance administrator can surface quickly." />
              <button className="attention-row" onClick={() => setTab("claims")}><span><AlertTriangle size={16} /> Unclaimed organisation profiles</span><strong>{unclaimed.length}</strong></button>
              <button className="attention-row" onClick={() => setTab("organisations")}><span><Users size={16} /> Organisations without admins</span><strong>{withoutAdmins.length}</strong></button>
              <button className="attention-row" onClick={() => setTab("accuracy")}><span><ClipboardCheck size={16} /> Listings not checked in this session</span><strong>{Math.max(0, published.length - Object.keys(checks).length)}</strong></button>
            </div>
            <div className="management-card">
              <CardTitle icon={ShieldCheck} title="Admin scope in the real platform" text="The sandbox demonstrates the workflow without connecting live services." />
              <ul className="feature-list">
                <li>Review and manage community content</li>
                <li>See claimed/unclaimed organisation coverage</li>
                <li>Handle profile claims and organisation admins</li>
                <li>Message individual or all organisations</li>
                <li>Review accuracy and organiser attribution</li>
              </ul>
              <Link to="/sandbox" className="button button-secondary">Open full Sandbox Studio <ArrowRight size={16} /></Link>
            </div>
          </div>
        </>
      )}

      {tab === "content" && (
        <AdminPanel title="Content management" text="Change a fictional event between published and draft. The public Events page updates immediately.">
          <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Event</th><th>Organisation</th><th>Status</th><th>Action</th></tr></thead><tbody>{state.events.map((event) => {
            const org = state.organisations.find((item) => item.id === event.orgId);
            return <tr key={event.id}><td>{event.title}</td><td>{org?.name || "No organisation"}</td><td><StatusPill label={event.status} /></td><td><button className="table-action" onClick={() => updateEvent(event.id, { status: event.status === "published" ? "draft" : "published" })}>{event.status === "published" ? "Move to draft" : "Publish"}</button></td></tr>;
          })}</tbody></table></div>
        </AdminPanel>
      )}

      {tab === "organisations" && (
        <AdminPanel title="Organisation access overview" text="See claimed status and admin coverage, then simulate tidying a profile's access state.">
          <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Organisation</th><th>Claim</th><th>Admins</th><th>Action</th></tr></thead><tbody>{state.organisations.map((org) => <tr key={org.id}><td>{org.name}</td><td>{org.claimed ? <StatusPill label="claimed" tone="good" /> : <StatusPill label="unclaimed" />}</td><td>{(org.admins || []).length}</td><td><button className="table-action" onClick={() => updateOrganisation(org.id, org.claimed ? { claimed: false, admins: [] } : { claimed: true, admins: [`demo.admin@${org.id}.example.invalid`] })}>{org.claimed ? "Mark unclaimed" : "Mark claimed"}</button></td></tr>)}</tbody></table></div>
        </AdminPanel>
      )}

      {tab === "messages" && (
        <div className="management-grid two-col">
          <div className="management-card">
            <CardTitle icon={MessageSquare} title="Demo inbox" text="Fictional inbound messages only." />
            <div className="message-list">{messages.map((message) => <button key={message.id} className={!message.read ? "unread" : ""} onClick={() => setMessages((rows) => rows.map((row) => row.id === message.id ? { ...row, read: true } : row))}><span><strong>{message.subject}</strong><small>{message.from}</small></span>{!message.read && <span className="message-dot" />}</button>)}</div>
          </div>
          <div className="management-card">
            <CardTitle icon={Send} title="Compose" text="Sending is simulated and never calls an email provider." />
            <form className="management-form" onSubmit={sendMessage}>
              <label className="management-field"><span>To</span><select value={compose.to} onChange={(e) => setCompose((c) => ({ ...c, to: e.target.value }))}><option>all organisations</option>{state.organisations.map((org) => <option key={org.id}>{org.name}</option>)}</select></label>
              <Field label="Subject" value={compose.subject} onChange={(value) => setCompose((current) => ({ ...current, subject: value }))} />
              <Field label="Message" value={compose.body} onChange={(value) => setCompose((current) => ({ ...current, body: value }))} multiline />
              <button className="button button-primary" type="submit"><Send size={16} /> Simulate send</button>
            </form>
          </div>
        </div>
      )}

      {tab === "claims" && (
        <AdminPanel title="Profile claims" text="In the real platform these require verification. Here the approval button simply demonstrates the resulting access state.">
          <div className="claim-grid">{unclaimed.map((org, index) => <div className="claim-card" key={org.id}><div className="claim-icon"><Building2 size={20} /></div><div><strong>{org.name}</strong><p>Fictional claimant: Demo Representative {index + 1}<br />representative{index + 1}@example.invalid</p></div><button className="button button-primary" onClick={() => approveClaim(org)}><BadgeCheck size={16} /> Approve demo claim</button></div>)}</div>
          {!unclaimed.length && <div className="empty-management"><CheckCircle2 size={24} /> All fictional profiles are currently marked claimed. Toggle one under Organisations to try this again.</div>}
        </AdminPanel>
      )}

      {tab === "accuracy" && (
        <AdminPanel title="Accuracy & credibility" text="This is deliberately a simulation: no web search or AI service is called from the demo.">
          <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Event</th><th>Result</th><th></th></tr></thead><tbody>{published.map((event) => <tr key={event.id}><td>{event.title}</td><td>{checks[event.id] ? <StatusPill label={checks[event.id]} tone={checks[event.id] === "Looks accurate" ? "good" : "warn"} /> : <span className="muted">Not checked this session</span>}</td><td><button className="table-action" onClick={() => simulateCheck(event)}><RefreshCw size={14} /> Run simulated check</button></td></tr>)}</tbody></table></div>
        </AdminPanel>
      )}
    </section>
  );
}

function ManagementHeading({ eyebrow, title, text, icon: Icon }) {
  return <div className="management-heading"><div className="management-heading-icon"><Icon size={24} /></div><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div></div>;
}

function Metric({ icon: Icon, value, label }) {
  return <div className="management-metric"><Icon size={18} /><strong>{value}</strong><span>{label}</span></div>;
}

function CardTitle({ icon: Icon, title, text }) {
  return <div className="management-card-title"><span><Icon size={18} /></span><div><h2>{title}</h2><p>{text}</p></div></div>;
}

function AdminPanel({ title, text, children }) {
  return <div className="management-card management-wide-card"><div className="panel-heading"><h2>{title}</h2><p>{text}</p></div>{children}</div>;
}

function Field({ label, value, onChange, multiline = false, placeholder = "" }) {
  return <label className="management-field"><span>{label}</span>{multiline ? <textarea rows={4} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /> : <input value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />}</label>;
}

function StatusPill({ label, tone = "" }) {
  const clean = String(label || "").toLowerCase();
  const inferred = tone || (clean.includes("publish") || clean.includes("claim") || clean.includes("accurate") ? "good" : clean.includes("review") ? "warn" : "");
  return <span className={`management-status ${inferred}`}>{label}</span>;
}
