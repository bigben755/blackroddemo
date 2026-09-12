import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, CalendarDays, HeartHandshake, Newspaper, Sparkles } from "lucide-react";
import { useDemo } from "../DemoContext";
import { EventCard, OrganisationCard, SectionHeading } from "../components/DemoCards";

export default function Home() {
  const { state } = useDemo();
  const featured = state.events.filter((event) => event.status === "published").slice(0, 3);
  const orgs = state.organisations.slice(0, 3);
  const feed = state.feed.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="page-container hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker"><Sparkles size={16} /> Community platform sandbox</span>
            <h1>{state.config.siteName}</h1>
            <p className="hero-tagline">{state.config.tagline}</p>
            <p className="hero-lead">
              A fictional demonstration of how a local Community Alliance could bring events, organisations, updates, volunteering and useful community information together in one place.
            </p>
            <div className="hero-actions">
              <Link to="/events" className="button button-primary">Explore What's On <ArrowRight size={17} /></Link>
              <Link to="/sandbox" className="button button-secondary">Try editing the demo</Link>
            </div>
            <div className="fictional-note">No real Blackrod organisations, events or contact data are used in this sandbox.</div>
          </div>

          <div className="hero-bento">
            <Link to="/feed" className="hero-tile primary-tile">
              <Newspaper size={28} />
              <span>What's New</span>
              <strong>Local updates</strong>
            </Link>
            <Link to="/events" className="hero-tile lime-tile">
              <CalendarDays size={28} />
              <span>What's On</span>
              <strong>{state.events.length} demo events</strong>
            </Link>
            <Link to="/organisations" className="hero-tile pink-tile">
              <Building2 size={28} />
              <span>What's Next</span>
              <strong>Find local groups</strong>
            </Link>
            <Link to="/volunteering" className="hero-tile neutral-tile">
              <HeartHandshake size={28} />
              <span>Get involved</span>
              <strong>Volunteer locally</strong>
            </Link>
          </div>
        </div>
      </section>

      <section className="section page-container">
        <SectionHeading
          eyebrow="What's On"
          title="Coming up in your demo community"
          text="These are deliberately fictional listings. Save one, open the detail page or change it in Sandbox Studio."
          action={<Link to="/events" className="text-link">See all events →</Link>}
        />
        <div className="card-grid">{featured.map((event) => <EventCard key={event.id} event={event} />)}</div>
      </section>

      <section className="section section-tinted">
        <div className="page-container">
          <SectionHeading
            eyebrow="What's New"
            title="Community updates in one feed"
            text="Organisations can keep people informed between formal events and announcements."
            action={<Link to="/feed" className="text-link">Open local feed →</Link>}
          />
          <div className="feed-preview-grid">
            {feed.map((post) => {
              const org = state.organisations.find((item) => item.id === post.orgId);
              return (
                <article className="feed-preview" key={post.id}>
                  <div className="feed-org">{org?.name || "Demo organisation"}</div>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                  <span>{post.likes} demo likes</span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section page-container">
        <SectionHeading
          eyebrow="Organisations"
          title="A directory that local groups can manage"
          text="Profiles can carry contact information, events, updates and volunteering opportunities."
          action={<Link to="/organisations" className="text-link">Browse directory →</Link>}
        />
        <div className="card-grid">{orgs.map((org) => <OrganisationCard key={org.id} org={org} />)}</div>
      </section>

      <section className="section page-container">
        <div className="sandbox-callout">
          <div>
            <div className="eyebrow">Now try it yourself</div>
            <h2>Everything in this demo is safe to change</h2>
            <p>Add a fictional organisation, publish a sample event, create a local update or alter your proposed platform name. Reset the whole sandbox whenever you want.</p>
          </div>
          <Link to="/sandbox" className="button button-primary">Open Sandbox Studio <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
