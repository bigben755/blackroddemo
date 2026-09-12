import React from "react";
import { MapPin, Users } from "lucide-react";
import { useDemo } from "../DemoContext";
import { EmptyState, SectionHeading } from "../components/DemoCards";

export default function Venues() {
  const { state } = useDemo();
  const [query, setQuery] = React.useState("");
  const rows = state.venues.filter((venue) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [venue.name, venue.address, ...(venue.facilities || [])].join(" ").toLowerCase().includes(needle);
  });

  return (
    <section className="section page-container page-top">
      <SectionHeading
        eyebrow="Useful places"
        title="Community venues"
        text="Show residents where activities happen and what facilities are available. These venues are fictional."
      />
      <div className="filter-bar single-filter">
        <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search demo venues…" />
      </div>
      {rows.length ? (
        <div className="card-grid">
          {rows.map((venue) => (
            <article className="card venue-card" key={venue.id}>
              <div className="venue-icon"><MapPin size={24} /></div>
              <h3>{venue.name}</h3>
              <p className="card-copy">{venue.address}</p>
              <div className="facility-list">
                {(venue.facilities || []).map((facility) => <span key={facility}>{facility}</span>)}
              </div>
              <div className="venue-capacity"><Users size={15} /> {venue.capacity ? `Up to ${venue.capacity} people` : "Open outdoor venue"}</div>
            </article>
          ))}
        </div>
      ) : <EmptyState icon={MapPin} title="No venues match" text="Try another search or add a fictional venue in Sandbox Studio." />}
    </section>
  );
}
