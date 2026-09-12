import React from "react";
import { Bell, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemo } from "../DemoContext";
import { EmptyState, EventCard, SectionHeading } from "../components/DemoCards";

export function SavedEvents() {
  const { state } = useDemo();
  const rows = state.events.filter((event) => state.savedEventIds.includes(event.id));

  return (
    <section className="section page-container page-top">
      <SectionHeading eyebrow="For later" title="Saved events" text="Residents can keep a shortlist of events they are interested in." />
      {rows.length ? <div className="card-grid">{rows.map((event) => <EventCard key={event.id} event={event} />)}</div> : (
        <EmptyState icon={Bookmark} title="Nothing saved yet" text="Save any fictional event and it will appear here." action={<Link to="/events" className="button button-primary">Browse events</Link>} />
      )}
    </section>
  );
}

export function Notifications() {
  const { state, markNotificationsRead } = useDemo();
  const unread = state.notifications.filter((item) => !item.read).length;

  return (
    <section className="section page-container page-top narrow-page">
      <SectionHeading
        eyebrow="Updates"
        title="Notifications"
        text="A simplified demonstration of how residents or organisation users could receive platform notifications."
        action={unread > 0 ? <button className="button button-outline compact" onClick={markNotificationsRead}>Mark all read</button> : null}
      />
      {state.notifications.length ? (
        <div className="stack-list">
          {state.notifications.map((item) => (
            <article className={`notification-card ${item.read ? "read" : "unread"}`} key={item.id}>
              <span className="notification-icon"><Bell size={18} /></span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span>{new Date(item.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </article>
          ))}
        </div>
      ) : <EmptyState icon={Bell} title="No notifications" text="The sandbox will show notifications here when demonstration actions create them." />}
    </section>
  );
}
