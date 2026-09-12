import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, Building2, CalendarDays, Clock, MapPin } from "lucide-react";
import { useDemo } from "../DemoContext";

export const formatEventDate = (value) => {
  if (!value) return "Date to be confirmed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

export function SectionHeading({ eyebrow, title, text, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function EventCard({ event }) {
  const { state, toggleSavedEvent } = useDemo();
  const org = state.organisations.find((item) => item.id === event.orgId);
  const venue = state.venues.find((item) => item.id === event.venueId);
  const saved = state.savedEventIds.includes(event.id);

  return (
    <article className="card event-card">
      <div className="event-card-topline">
        <span className="category-chip">{event.category || "Community"}</span>
        <button
          className={`save-button ${saved ? "saved" : ""}`}
          onClick={() => toggleSavedEvent(event.id)}
          aria-label={saved ? "Remove from saved events" : "Save event"}
          title={saved ? "Remove from saved" : "Save event"}
        >
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <Link to={`/events/${event.id}`} className="card-link">
        <div className="event-date-block">
          <CalendarDays size={17} />
          <strong>{formatEventDate(event.start)}</strong>
          <span>{formatTime(event.start)}{event.end ? `–${formatTime(event.end)}` : ""}</span>
        </div>
        <h3>{event.title}</h3>
        <p className="card-copy">{event.description}</p>
        <div className="meta-stack">
          <span><Building2 size={14} /> {org?.name || "Demo organiser"}</span>
          <span><MapPin size={14} /> {venue?.name || "Venue to be confirmed"}</span>
        </div>
      </Link>
      <div className="card-footer-line">
        <span>{event.fee || "Free"}</span>
        <Link to={`/events/${event.id}`} className="text-link">View event →</Link>
      </div>
    </article>
  );
}

export function OrganisationCard({ org }) {
  return (
    <article className="card organisation-card">
      <div className="org-avatar"><Building2 size={25} /></div>
      <div className="category-chip">{org.category || "Community"}</div>
      <h3>{org.name}</h3>
      <p className="card-copy">{org.short}</p>
      <div className="org-status-row">
        <span className={`status-dot ${org.claimed ? "claimed" : "unclaimed"}`}></span>
        {org.claimed ? "Managed profile" : "Unclaimed demo profile"}
      </div>
      <Link to={`/organisations/${org.id}`} className="button button-outline full-width">View organisation</Link>
    </article>
  );
}

export function EmptyState({ icon: Icon = Clock, title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon size={24} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
