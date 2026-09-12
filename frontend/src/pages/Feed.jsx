import React from "react";
import { Heart, Newspaper } from "lucide-react";
import { useDemo } from "../DemoContext";
import { EmptyState, SectionHeading } from "../components/DemoCards";

export default function Feed() {
  const { state, likeFeedPost } = useDemo();

  return (
    <section className="section page-container page-top">
      <SectionHeading
        eyebrow="What's New"
        title="Local feed"
        text="A simple stream of community updates between formal events. Every post here is fictional."
      />

      {state.feed.length ? (
        <div className="feed-list">
          {state.feed.map((post) => {
            const org = state.organisations.find((item) => item.id === post.orgId);
            return (
              <article className="feed-card" key={post.id}>
                <div className="feed-card-header">
                  <div>
                    <div className="feed-org">{org?.name || "Demo organisation"}</div>
                    <h2>{post.title}</h2>
                  </div>
                  <span className="category-chip">Demo update</span>
                </div>
                <p>{post.body}</p>
                <div className="feed-card-footer">
                  <span>{new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <button className="like-button" onClick={() => likeFeedPost(post.id)}><Heart size={16} /> {post.likes || 0}</button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Newspaper} title="No feed posts yet" text="Create one in Sandbox Studio to see how updates appear to residents." />
      )}
    </section>
  );
}
