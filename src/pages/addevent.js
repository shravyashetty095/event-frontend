import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createEvent, getCurrentUser, getEventsForClub } from "../utils/storage";

function AddEvent({ embedded = false, onClose = null, onCreated = null }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!embedded && (!currentUser || currentUser.role !== "club")) {
      navigate("/");
    }
  }, [currentUser, embedded, navigate]);

  if (!currentUser || currentUser.role !== "club") {
    return null;
  }

  const handleAdd = (event) => {
    event.preventDefault();

    if (!title.trim() || !date || !location.trim()) {
      setError("Please add a title, date, and location.");
      return;
    }

    if (capacity && Number(capacity) <= 0) {
      setError("Capacity must be greater than 0.");
      return;
    }

    try {
      setSubmitting(true);
      createEvent({
        title,
        tags: tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        date,
        location,
        capacity,
        clubId: currentUser.id,
        clubName: currentUser.name,
      });
      setTitle("");
      setTags("");
      setDate("");
      setLocation("");
      setCapacity("");
      setError("");
      if (embedded) {
        onCreated?.();
        onClose?.();
      } else {
        navigate("/club");
      }
    } catch (submissionError) {
      setError(submissionError.message || "Failed to add event.");
    } finally {
      setSubmitting(false);
    }
  };

  const hostedEvents = getEventsForClub(currentUser.id);

  const formContent = (
    <>
      <div className="section-head">
        <div>
          <p className="eyebrow">Club tools</p>
          <h1>Add a new event</h1>
        </div>
        {embedded ? (
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        ) : (
          <Link to="/club" className="btn btn-secondary">
            Back to dashboard
          </Link>
        )}
      </div>

      <form className="form-stack" onSubmit={handleAdd}>
        <label className="field">
          <span>Event title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter Title" required />
        </label>

        <div className="field-grid">
          <label className="field">
            <span>Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          </label>
        </div>

        <label className="field">
          <span>Location</span>
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Innovation Hall" required />
        </label>

        <div className="field-grid">
          <label className="field">
            <span>Tags</span>
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="AI, Coding, Workshop" />
          </label>

          <label className="field">
            <span>Capacity</span>
            <input type="number" min="1" value={capacity} onChange={(event) => setCapacity(event.target.value)} placeholder="60" />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Publishing..." : "Publish event"}
        </button>
      </form>
    </>
  );

  if (embedded) {
    return (
      <div className="add-event-embedded">
        {formContent}

        <aside className="content-panel sidebar-panel sidebar-panel--embedded">
          <p className="eyebrow">Hosted events</p>
          <h2>{hostedEvents.length} live on your account</h2>
          {hostedEvents.length === 0 ? (
            <p className="empty-state">Once you publish events, they will appear here with registration counts.</p>
          ) : (
            <div className="stack-list">
              {hostedEvents.map((event) => (
                <article key={event.id} className="mini-card">
                  <strong>{event.title}</strong>
                  <span>{event.date}</span>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    );
  }

  return (
    <main className="page-shell two-column-layout">
      <section className="content-panel form-panel">
        {formContent}
      </section>

      <aside className="content-panel sidebar-panel">
        <p className="eyebrow">Hosted events</p>
        <h2>{hostedEvents.length} live on your account</h2>
        {hostedEvents.length === 0 ? (
          <p className="empty-state">Once you publish events, they will appear here with registration counts.</p>
        ) : (
          <div className="stack-list">
            {hostedEvents.map((event) => (
              <article key={event.id} className="mini-card">
                <strong>{event.title}</strong>
                <span>{event.date}</span>
              </article>
            ))}
          </div>
        )}
      </aside>
    </main>
  );
}

export default AddEvent;
