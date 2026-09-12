import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Edit3,
  HeartHandshake,
  MapPin,
  Newspaper,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  Trash2,
} from "lucide-react";
import { useDemo } from "../DemoContext";
import { formatEventDate } from "../components/DemoCards";

const TABS = [
  ["overview", "Overview", Settings2],
  ["events", "Events", CalendarDays],
  ["organisations", "Organisations", Building2],
  ["venues", "Venues", MapPin],
  ["volunteering", "Volunteering", HeartHandshake],
  ["feed", "Local feed", Newspaper],
];

const blankForms = {
  event: { title: "", orgId: "", venueId: "", start: "", end: "", category: "Community", fee: "Free", description: "" },
  organisation: { name: "", category: "Community", short: "", claimed: false },
  venue: { name: "", address: "", facilities: "", capacity: "" },
  volunteering: { title: "", orgId: "", time: "", age: "", description: "" },
  feed: { title: "", orgId: "", body: "" },
};

const inputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function SandboxStudio() {
  const demo = useDemo();
  const { state } = demo;
  const [tab, setTab] = React.useState("overview");
  const [form, setForm] = React.useState(blankForms.event);
  const [editingId, setEditingId] = React.useState("");
  const [siteName, setSiteName] = React.useState(state.config.siteName);

  React.useEffect(() => setSiteName(state.config.siteName), [state.config.siteName]);

  const resetForm = (type) => {
    setEditingId("");
    setForm({ ...blankForms[type] });
  };

  const confirmReset = () => {
    if (!window.confirm("Restore all fictional starter data while keeping your chosen site name?")) return;
    demo.resetDemo();
    setEditingId("");
  };

  const saveSiteName = () => {
    const clean = siteName.trim();
    if (!clean) return window.alert("Enter a proposed platform name first.");
    demo.updateConfig({ siteName: clean });
  };

  const editEvent = (item) => {
    setEditingId(item.id);
    setForm({ ...item, start: inputDate(item.start), end: inputDate(item.end) });
  };

  const saveEvent = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.start) return window.alert("Add a title and start date/time.");
    const payload = {
      ...form,
      title: form.title.trim(),
      start: new Date(form.start).toISOString(),
      end: form.end ? new Date(form.end).toISOString() : "",
    };
    if (editingId) demo.updateEvent(editingId, payload);
    else demo.addEvent(payload);
    resetForm("event");
  };

  const editOrganisation = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, short: item.short, claimed: Boolean(item.claimed) });
  };

  const saveOrganisation = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return window.alert("Add an organisation name.");
    if (editingId) demo.updateOrganisation(editingId, form);
    else demo.addOrganisation(form);
    resetForm("organisation");
  };

  const editVenue = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      address: item.address,
      facilities: (item.facilities || []).join(", "),
      capacity: item.capacity ?? "",
    });
  };

  const saveVenue = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return window.alert("Add a venue name.");
    const payload = {
      ...form,
      facilities: String(form.facilities || "").split(",").map((item) => item.trim()).filter(Boolean),
      capacity: form.capacity === "" ? null : Number(form.capacity),
    };
    if (editingId) demo.updateVenue(editingId, payload);
    else demo.addVenue(payload);
    resetForm("venue");
  };

  const editVolunteer = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, orgId: item.orgId, time: item.time, age: item.age, description: item.description });
  };

  const saveVolunteer = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return window.alert("Add an opportunity title.");
    if (editingId) demo.updateVolunteer(editingId, form);
    else demo.addVolunteer(form);
    resetForm("volunteering");
  };

  const saveFeed = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return window.alert("Add a title and update text.");
    demo.addFeedPost(form);
    resetForm("feed");
  };

  const changeTab = (next) => {
    setTab(next);
    setEditingId("");
    if (next === "events") setForm({ ...blankForms.event });
    if (next === "organisations") setForm({ ...blankForms.organisation });
    if (next === "venues") setForm({ ...blankForms.venue });
    if (next === "volunteering") setForm({ ...blankForms.volunteering });
    if (next === "feed") setForm({ ...blankForms.feed });
  };

  return (
    <section className="section page-container page-top sandbox-page">
      <div className="sandbox-heading">
        <div>
          <div className="eyebrow">Sandbox Studio</div>
          <h1>Try managing the platform</h1>
          <p>Everything here changes only this browser's fictional copy. There is no production database, no real email and no connection to Blackrod Now.</p>
        </div>
        <button className="button button-outline" onClick={confirmReset}><RotateCcw size={16} /> Reset sandbox</button>
      </div>

      <div className="studio-tabs">
        {TABS.map(([key, label, Icon]) => (
          <button key={key} className={`studio-tab ${tab === key ? "active" : ""}`} onClick={() => changeTab(key)}><Icon size={16} /> {label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="studio-grid">
          <div className="studio-main">
            <div className="studio-panel">
              <h2>Shape the demo around your area</h2>
              <p className="muted">Change the proposed platform name and the public homepage/header updates immediately.</p>
              <label className="field-label">Proposed platform name</label>
              <div className="inline-form">
                <input className="input" value={siteName} onChange={(event) => setSiteName(event.target.value)} placeholder="e.g. My Community Now" />
                <button className="button button-primary" onClick={saveSiteName}><Save size={16} /> Apply name</button>
              </div>
            </div>

            <div className="studio-panel">
              <h2>Explore both sides of the platform</h2>
              <div className="explore-grid">
                <Link to="/" className="explore-card"><strong>Resident view</strong><span>Homepage, events, organisations, local feed, venues, volunteering and saved items.</span></Link>
                <button className="explore-card" onClick={() => changeTab("events")}><strong>Alliance management</strong><span>Create, edit and remove fictional content using the controls in this studio.</span></button>
              </div>
            </div>
          </div>
          <aside className="studio-sidebar">
            <div className="metric-grid">
              <Metric value={state.events.length} label="Events" />
              <Metric value={state.organisations.length} label="Organisations" />
              <Metric value={state.venues.length} label="Venues" />
              <Metric value={state.volunteering.length} label="Volunteer roles" />
              <Metric value={state.feed.length} label="Feed posts" />
              <Metric value={state.savedEventIds.length} label="Saved events" />
            </div>
            <div className="info-callout small"><strong>Tip:</strong> Try adding your own imaginary organisation and event, then switch back to the resident pages to see them immediately.</div>
          </aside>
        </div>
      )}

      {tab === "events" && (
        <CrudLayout title={editingId ? "Edit demo event" : "Add demo event"} form={
          <form className="studio-form" onSubmit={saveEvent}>
            <Field label="Title"><input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></Field>
            <div className="form-grid-2">
              <Field label="Organisation"><select className="input" value={form.orgId} onChange={(e) => setForm((f) => ({ ...f, orgId: e.target.value }))}><option value="">Choose organisation</option>{state.organisations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
              <Field label="Venue"><select className="input" value={form.venueId} onChange={(e) => setForm((f) => ({ ...f, venueId: e.target.value }))}><option value="">Choose venue</option>{state.venues.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
              <Field label="Starts"><input type="datetime-local" className="input" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} /></Field>
              <Field label="Ends"><input type="datetime-local" className="input" value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} /></Field>
              <Field label="Category"><input className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} /></Field>
              <Field label="Fee"><input className="input" value={form.fee} onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))} /></Field>
            </div>
            <Field label="Description"><textarea className="input textarea" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></Field>
            <FormButtons editing={Boolean(editingId)} onCancel={() => resetForm("event")} />
          </form>
        } list={state.events.map((item) => (
          <StudioRow key={item.id} title={item.title} detail={`${formatEventDate(item.start)} · ${state.organisations.find((o) => o.id === item.orgId)?.name || "No organisation"}`} onEdit={() => editEvent(item)} onDelete={() => confirmDelete(item.title, () => demo.deleteEvent(item.id))} />
        ))} />
      )}

      {tab === "organisations" && (
        <CrudLayout title={editingId ? "Edit demo organisation" : "Add demo organisation"} form={
          <form className="studio-form" onSubmit={saveOrganisation}>
            <Field label="Name"><input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Category"><input className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} /></Field>
            <Field label="Short description"><textarea className="input textarea" value={form.short} onChange={(e) => setForm((f) => ({ ...f, short: e.target.value }))} /></Field>
            <label className="check-row"><input type="checkbox" checked={Boolean(form.claimed)} onChange={(e) => setForm((f) => ({ ...f, claimed: e.target.checked }))} /> Show as claimed/managed</label>
            <FormButtons editing={Boolean(editingId)} onCancel={() => resetForm("organisation")} />
          </form>
        } list={state.organisations.map((item) => (
          <StudioRow key={item.id} title={item.name} detail={`${item.category} · ${item.claimed ? "Managed profile" : "Unclaimed"}`} onEdit={() => editOrganisation(item)} onDelete={() => confirmDelete(item.name, () => demo.deleteOrganisation(item.id), true)} />
        ))} />
      )}

      {tab === "venues" && (
        <CrudLayout title={editingId ? "Edit demo venue" : "Add demo venue"} form={
          <form className="studio-form" onSubmit={saveVenue}>
            <Field label="Name"><input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Address"><input className="input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} /></Field>
            <Field label="Facilities (comma separated)"><input className="input" value={form.facilities} onChange={(e) => setForm((f) => ({ ...f, facilities: e.target.value }))} /></Field>
            <Field label="Capacity"><input type="number" min="0" className="input" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} /></Field>
            <FormButtons editing={Boolean(editingId)} onCancel={() => resetForm("venue")} />
          </form>
        } list={state.venues.map((item) => (
          <StudioRow key={item.id} title={item.name} detail={item.address} onEdit={() => editVenue(item)} onDelete={() => confirmDelete(item.name, () => demo.deleteVenue(item.id))} />
        ))} />
      )}

      {tab === "volunteering" && (
        <CrudLayout title={editingId ? "Edit demo opportunity" : "Add demo opportunity"} form={
          <form className="studio-form" onSubmit={saveVolunteer}>
            <Field label="Title"><input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></Field>
            <Field label="Organisation"><select className="input" value={form.orgId} onChange={(e) => setForm((f) => ({ ...f, orgId: e.target.value }))}><option value="">Choose organisation</option>{state.organisations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
            <div className="form-grid-2"><Field label="Time commitment"><input className="input" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} /></Field><Field label="Age"><input className="input" value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} /></Field></div>
            <Field label="Description"><textarea className="input textarea" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></Field>
            <FormButtons editing={Boolean(editingId)} onCancel={() => resetForm("volunteering")} />
          </form>
        } list={state.volunteering.map((item) => (
          <StudioRow key={item.id} title={item.title} detail={`${state.organisations.find((o) => o.id === item.orgId)?.name || "No organisation"} · ${item.time || "Flexible"}`} onEdit={() => editVolunteer(item)} onDelete={() => confirmDelete(item.title, () => demo.deleteVolunteer(item.id))} />
        ))} />
      )}

      {tab === "feed" && (
        <CrudLayout title="Add fictional local update" form={
          <form className="studio-form" onSubmit={saveFeed}>
            <Field label="Organisation"><select className="input" value={form.orgId} onChange={(e) => setForm((f) => ({ ...f, orgId: e.target.value }))}><option value="">Choose organisation</option>{state.organisations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
            <Field label="Title"><input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></Field>
            <Field label="Update"><textarea className="input textarea" value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} /></Field>
            <FormButtons />
          </form>
        } list={state.feed.map((item) => (
          <StudioRow key={item.id} title={item.title} detail={state.organisations.find((o) => o.id === item.orgId)?.name || "Demo organisation"} onDelete={() => confirmDelete(item.title, () => demo.deleteFeedPost(item.id))} />
        ))} />
      )}
    </section>
  );
}

function confirmDelete(name, action, cascade = false) {
  const extra = cascade ? "\n\nAny demo events, volunteer roles and posts attached to it will also be removed." : "";
  if (window.confirm(`Delete “${name}” from this browser's sandbox?${extra}`)) action();
}

function Metric({ value, label }) {
  return <div className="metric-card"><strong>{value}</strong><span>{label}</span></div>;
}

function CrudLayout({ title, form, list }) {
  return (
    <div className="crud-layout">
      <div className="studio-panel sticky-panel"><h2>{title}</h2>{form}</div>
      <div className="studio-panel"><h2>Current fictional content</h2><div className="studio-list">{list}</div></div>
    </div>
  );
}

function StudioRow({ title, detail, onEdit, onDelete }) {
  return (
    <div className="studio-row">
      <div><strong>{title}</strong><span>{detail}</span></div>
      <div className="row-actions">
        {onEdit && <button onClick={onEdit} title="Edit"><Edit3 size={15} /> Edit</button>}
        {onDelete && <button className="danger" onClick={onDelete} title="Delete"><Trash2 size={15} /> Delete</button>}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function FormButtons({ editing = false, onCancel }) {
  return (
    <div className="form-actions">
      <button type="submit" className="button button-primary"><Plus size={16} /> {editing ? "Save changes" : "Add to demo"}</button>
      {editing && <button type="button" className="button button-outline" onClick={onCancel}>Cancel</button>}
    </div>
  );
}
