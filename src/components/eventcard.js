import React from "react";

export default function EventCard({ event = {}, onRegister = null }) {
  const formattedDate = event.date ? new Date(event.date).toLocaleDateString() : "TBA";
  return (
    <article className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <h3 style={{ margin: 0 }}>{event.title || "Untitled event"}</h3>
        <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
          <strong>Date:</strong> {formattedDate}
        </p>
        {event.tags && event.tags.length > 0 && (
          <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
            <strong>Tags:</strong> {Array.isArray(event.tags) ? event.tags.join(", ") : event.tags}
          </p>
        )}
      </div>

      {onRegister && (
        <div style={{ marginTop: "auto" }}>
          <button className="btn primary" onClick={onRegister} aria-label="Register">
            Register
          </button>
        </div>
      )}
    </article>
  );
}