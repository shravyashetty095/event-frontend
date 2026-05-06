import React from "react";

function formatDate(dateValue) {
  if (!dateValue) {
    return "To be announced";
  }

<<<<<<< HEAD
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(parsedDate);
}

export default function EventCard({
  event = {},
  currentUser = null,
  onPrimaryAction = null,
  primaryActionLabel = "Register",
  primaryActionDisabled = false,
  registrantsVisible = false,
}) {
  const registrants = Array.isArray(event.registrants) ? event.registrants : [];
  const isStudent = currentUser?.role === "student";
  const isClub = currentUser?.role === "club";
=======
  // current user info
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isStudent = user && user.role === "student";
  const isClubUser = user && user.role === "club";

  // if the logged-in club owns this event, treat as owner (hide register)
  const isOwner =
    isClubUser &&
    (event.clubId === user._id ||
      (event.club && (event.club === user.name || event.club === user.email)));
>>>>>>> 15f00fb803a7a59a1fc8dafbb15b4ea2e15d57de

  return (
    <article className="event-card">
      <div className="event-card__top">
        <div>
          <p className="event-card__club">{event.clubName || "Campus club"}</p>
          <h3>{event.title || "Untitled event"}</h3>
        </div>

        <span className="event-badge">{event.registrationCount || 0} registered</span>
      </div>

<<<<<<< HEAD
      <p className="event-card__description">{event.description || "No description provided yet."}</p>

      <div className="event-meta-grid">
        <div>
          <span>Date</span>
          <strong>{formatDate(event.date)}</strong>
        </div>
        <div>
          <span>Location</span>
          <strong>{event.location || "TBA"}</strong>
        </div>
        <div>
          <span>Capacity</span>
          <strong>{event.capacity || "Open"}</strong>
        </div>
      </div>

      {Array.isArray(event.tags) && event.tags.length > 0 && (
        <div className="chip-row chip-row--compact">
          {event.tags.map((tag) => (
            <span key={tag} className="chip chip--soft">
              {tag}
            </span>
          ))}
        </div>
      )}

      {registrantsVisible && (isClub || registrants.length > 0) && (
        <div className="registrant-box">
          <span>Registered students</span>
          {registrants.length === 0 ? <strong>No registrations yet</strong> : <strong>{registrants.map((registration) => registration.userName).join(", ")}</strong>}
        </div>
      )}

      {isStudent && onPrimaryAction && (
        <div className="event-card__actions">
          <button className="btn btn-primary" type="button" onClick={onPrimaryAction} disabled={primaryActionDisabled}>
            {primaryActionLabel}
=======
      {/* show Register only to students and not to club owners */}
      {isStudent && !isOwner && onRegister && (
        <div style={{ marginTop: "auto" }}>
          <button className="btn primary" onClick={onRegister} aria-label="Register">
            Register
>>>>>>> 15f00fb803a7a59a1fc8dafbb15b4ea2e15d57de
          </button>
        </div>
      )}
    </article>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 15f00fb803a7a59a1fc8dafbb15b4ea2e15d57de
