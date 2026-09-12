import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Mail, Phone, ShieldCheck, Users } from "lucide-react";
import { useDemo } from "../DemoContext";
import { EmptyState, EventCard, OrganisationCard, SectionHeading } from "../components/DemoCards";

export function Organisations() {
  const { state } = useDemo();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const categories = ["all", ...Array.from(new Set(state.organisations.map((org) => org.category).filter(Boolean))).sort()];
  const rows = state.organisations.filter((org) => {
    if (category !== "all" && org.category !== category) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [org.name, org.category, org.short].filter(Boolean).join(" ").toLowerCase().includes(needle);
  });

  return (
    <section className="section page-container page-top">
      <SectionHeading
        eyebrow="Community directory"
        title="Organisations"
        text="A searchable home for local groups, clubs, services and community bodies. Every profile below is fictional."
      />
      <div className="filter-bar">
        <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search demo organisations…" />
        <select className="input select" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item === "all" ? "All categories" : item}</option>)}
        </select>
      </div>
      {rows.length ? <div className="card-grid">{rows.map((org) => <OrganisationCard key={org.id} org={org} />)}</div> : (
        <EmptyState icon={Building2} title="No organisations match" text="Try another search or add a fictional profile in Sandbox Studio." />
      )}
    </section>
  );
}

export function OrganisationDetail() {
  const { id } = useParams();
  const { state, updateOrganisation } = useDemo();
  const org = state.organisations.find((item) => item.id === id);
  if (!org) return <section className="section page-container page-top"><EmptyState title="Organisation not found" text="It may have been removed from this sandbox." action={<Link to="/organisations" className="button button-primary">Back to organisations</Link>} /></section>;

  const events = state.events.filter((event) => event.orgId === org.id && event.status === "published");
  const volunteering = state.volunteering.filter((item) => item.orgId === org.id);
  const feed = state.feed.filter((post) => post.orgId === org.id);

  const simulateClaim = () => {
    if (org.claimed) return;
    if (!window.confirm("Simulate an approved profile claim for this fictional organisation?")) return;
    updateOrganisation(org.id, { claimed: true, admins: ["sandbox.manager@example.invalid"] });
  };

  return (
    <section className="section page-container page-top">
      <Link to="/organisations" className="back-link"><ArrowLeft size={16} /> Back to organisations</Link>
      <div className="organisation-hero">
        <div className="org-avatar large"><Building2 size={34} /></div>
        <div className="organisation-hero-copy">
          <span className="category-chip">{org.category}</span>
          <h1>{org.name}</h1>
          <p>{org.short}</p>
          <div className="profile-status-row">
            {org.claimed ? <span className="profile-badge claimed"><ShieldCheck size={15} /> Managed profile</span> : <span className="profile-badge"><Users size={15} /> Unclaimed demo profile</span>}
            {!org.claimed && <button className="button button-outline compact" onClick={simulateClaim}>Simulate claim</button>}
          </div>
        </div>
      </div>

      <div className="org-contact-grid">
        <div className="detail-panel"><Mail size={19} /><div><span>Email</span><strong>{org.email}</strong></div></div>
        <div className="detail-panel"><Phone size={19} /><div><span>Phone</span><strong>{org.phone || "Not supplied"}</strong></div></div>
        <div className="detail-panel"><Users size={19} /><div><span>Demo admins</span><strong>{org.admins?.length || 0}</strong></div></div>
      </div>

      <div className="subsection">
        <SectionHeading eyebrow="Events" title={`What's on from ${org.name}`} text="Fictional events attached to this demo profile." />
        {events.length ? <div className="card-grid">{events.map((event) => <EventCard key={event.id} event={event} />)}</div> : <EmptyState title="No current demo events" text="Add one in Sandbox Studio and assign it to this organisation." />}
      </div>

      <div className="subsection two-column-section">
        <div>
          <div className="eyebrow">Latest updates</div>
          <h2>Local feed posts</h2>
          <div className="stack-list">
            {feed.length ? feed.map((post) => <article key={post.id} className="mini-panel"><strong>{post.title}</strong><p>{post.body}</p></article>) : <p className="muted">No updates yet.</p>}
          </div>
        </div>
        <div>
          <div className="eyebrow">Get involved</div>
          <h2>Volunteering</h2>
          <div className="stack-list">
            {volunteering.length ? volunteering.map((item) => <article key={item.id} className="mini-panel"><strong>{item.title}</strong><p>{item.description}</p><span>{item.time}</span></article>) : <p className="muted">No opportunities yet.</p>}
          </div>
        </div>
      </div>

      <div className="info-callout"><strong>Demonstration only.</strong> The organisation, contact information and activity on this profile are fictional.</div>
    </section>
  );
}
