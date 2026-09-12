import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Building2, CalendarDays, MapPin } from "lucide-react";
import { useDemo } from "../DemoContext";
import { EmptyState, EventCard, formatEventDate, formatTime, SectionHeading } from "../components/DemoCards";

export function Events() {
  const { state } = useDemo();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const categories = ["all", ...Array.from(new Set(state.events.map((event) => event.category).filter(Boolean))).sort()];
  const rows = state.events
    .filter((event) => event.status === "published")
    .filter((event) => category === "all" || event.category === category)
    .filter((event) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      const org = state.organisations.find((item) => item.id === event.orgId);
      const venue = state.venues.find((item) => item.id === event.venueId);
      return [event.title, event.description, event.category, org?.name, venue?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    })
    .sort((a, b) => String(a.start).localeCompare(String(b.start)));

  return (
    <section className="section page-container page-top">
      <SectionHeading
        eyebrow="What's On"
        title="Events"
        text="Search and filter fictional listings exactly as residents would use a live community directory."
      />
      <div className="filter-bar">
        <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search demo events…" />
        <select className="input select" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item === "all" ? "All categories" : item}</option>)}
        </select>
      </div>
      {rows.length ? <div className="card-grid">{rows.map((event) => <EventCard key={event.id} event={event} />)}</div> : (
        <EmptyState icon={CalendarDays} title="No events match" text="Try another search, or create a sample event in Sandbox Studio." action={<Link className="button button-primary" to="/sandbox">Create demo event</Link>} />
      )}
    </section>
  );
}

export function EventDetail() {
  const { id } = useParams();
  const { state, toggleSavedEvent } = useDemo();
  const event = state.events.find((item) => item.id === id);
  if (!event) return <section className="section page-container page-top"><EmptyState title="Event not found" text="It may have been removed from this browser's sandbox." action={<Link to="/events" className="button button-primary">Back to events</Link>} /></section>;

  const org = state.organisations.find((item) => item.id === event.orgId);
  const venue = state.venues.find((item) => item.id === event.venueId);
  const saved = state.savedEventIds.includes(event.id);

  return (
    <section className="section page-container page-top narrow-page">
      <Link to="/events" className="back-link"><ArrowLeft size={16} /> Back to events</Link>
      <div className="detail-hero">
        <span className="category-chip">{event.category}</span>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <button className={`button ${saved ? "button-secondary" : "button-outline"}`} onClick={() => toggleSavedEvent(event.id)}><Bookmark size={16} /> {saved ? "Saved" : "Save event"}</button>
      </div>
      <div className="detail-grid">
        <div className="detail-panel">
          <CalendarDays size={21} />
          <div><span>Date & time</span><strong>{formatEventDate(event.start)} · {formatTime(event.start)}{event.end ? `–${formatTime(event.end)}` : ""}</strong></div>
        </div>
        <div className="detail-panel">
          <MapPin size={21} />
          <div><span>Venue</span><strong>{venue?.name || "To be confirmed"}</strong><small>{venue?.address || ""}</small></div>
        </div>
        <div className="detail-panel">
          <Building2 size={21} />
          <div><span>Organiser</span><strong>{org?.name || "Demo organiser"}</strong>{org && <Link to={`/organisations/${org.id}`}>View profile</Link>}</div>
        </div>
      </div>
      <div className="info-callout"><strong>Demonstration only.</strong> This event is fictional and cannot be booked or attended.</div>
    </section>
  );
}
