import React from "react";
import { HeartHandshake } from "lucide-react";
import { useDemo } from "../DemoContext";
import { EmptyState, SectionHeading } from "../components/DemoCards";

export default function Volunteering() {
  const { state } = useDemo();
  const [query, setQuery] = React.useState("");
  const rows = state.volunteering.filter((item) => {
    const org = state.organisations.find((entry) => entry.id === item.orgId);
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [item.title, item.description, item.time, item.age, org?.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  return (
    <section className="section page-container page-top">
      <SectionHeading
        eyebrow="Get involved"
        title="Volunteering"
        text="A place for local groups to advertise practical ways residents can help. Every opportunity below is fictional."
      />
      <div className="filter-bar single-filter">
        <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search demo opportunities…" />
      </div>
      {rows.length ? (
        <div className="card-grid">
          {rows.map((item) => {
            const org = state.organisations.find((entry) => entry.id === item.orgId);
            return (
              <article className="card volunteer-card" key={item.id}>
                <div className="venue-icon"><HeartHandshake size={24} /></div>
                <div className="category-chip">Volunteer</div>
                <h3>{item.title}</h3>
                <p className="card-copy">{item.description}</p>
                <div className="meta-stack">
                  <span><strong>Organisation:</strong> {org?.name || "Demo organisation"}</span>
                  <span><strong>Time:</strong> {item.time || "Flexible"}</span>
                  <span><strong>Age:</strong> {item.age || "Ask organiser"}</span>
                </div>
                <button className="button button-outline full-width" onClick={() => window.alert("Demo only — in a live platform this would contact the organisation or open its enquiry flow.")}>Get in touch</button>
              </article>
            );
          })}
        </div>
      ) : <EmptyState icon={HeartHandshake} title="No opportunities match" text="Try another search or add a fictional opportunity in Sandbox Studio." />}
    </section>
  );
}
