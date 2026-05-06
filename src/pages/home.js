import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EventCard from "../components/eventcard";
import {
  getCurrentUser,
  getEventRegistrations,
  getEventSummary,
  getEvents,
  getEventsForClub,
  getUserRegistrations,
  isUserRegisteredForEvent,
  registerForEvent,
} from "../utils/storage";

function Home() {
  const [events, setEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  const navigate = useNavigate();

  const loadDashboard = useCallback(() => {
    if (!user) {
      return;
    }

    const allEvents = getEvents();
    const userRegistrations = getUserRegistrations(user.id);

    setEvents(allEvents);
    setRegistrations(userRegistrations);

    if (user.role === "student" && Array.isArray(user.interests)) {
      const registeredEventIds = new Set(userRegistrations.map((registration) => registration.eventId));
      const matchedEvents = allEvents.filter(
        (event) =>
          Array.isArray(event.tags) &&
          event.tags.some((tag) => user.interests.includes(tag)) &&
          !registeredEventIds.has(event.id)
      );
      setRecommended(matchedEvents);
    } else {
      setRecommended([]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    setLoading(true);
    loadDashboard();
    setLoading(false);
  }, [loadDashboard, navigate, user]);

  if (!user) {
    return null;
  }

  const isStudent = user.role === "student";
  const isClub = user.role === "club";
  const hostedEvents = isClub ? getEventsForClub(user.id) : [];
  const totalRegistrations = isClub
    ? events.reduce((sum, event) => sum + getEventRegistrations(event.id).length, 0)
    : registrations.length;
  const registeredEvents = registrations
    .map((registration) => events.find((event) => event.id === registration.eventId))
    .filter(Boolean);
  const enrichedEvents = events.map((event) => getEventSummary(event));

  const handleRegister = (eventId) => {
    try {
      registerForEvent({ eventId, user });
      setLoading(true);
      loadDashboard();
      setLoading(false);
    } catch (error) {
      alert(error.message || "Registration failed.");
    }
  };

  return (
    <main className="page-shell dashboard-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">{isStudent ? "Student dashboard" : "Club dashboard"}</p>
          <h1>{isStudent ? `Welcome back, ${user.name}` : `Hello, ${user.name}`}</h1>
          <p>
            {isStudent
              ? "Browse campus events, register in one click, and keep track of everything you've joined."
              : "Create events for your club and see attendance counts update automatically for every event."}
          </p>

          {isStudent && Array.isArray(user.interests) && user.interests.length > 0 && (
            <div className="chip-row">
              {user.interests.map((interest) => (
                <span key={interest} className="chip">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="hero-actions">
          <div className="stat-grid">
            <article className="stat-card">
              <strong>{events.length}</strong>
              <span>Events</span>
            </article>
            <article className="stat-card">
              <strong>{recommended.length}</strong>
              <span>Matches</span>
            </article>
            <article className="stat-card">
              <strong>{totalRegistrations}</strong>
              <span>Registrations</span>
            </article>
          </div>

          {isClub ? (
            <Link to="/club/add" reloadDocument className="btn btn-primary">
              Add event
            </Link>
          ) : (
            <button className="btn btn-secondary" type="button" onClick={() => document.getElementById("all-events")?.scrollIntoView({ behavior: "smooth" })}>
              Browse events
            </button>
          )}
        </div>
      </section>

      {isStudent && (
        <section className="content-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">My registrations</p>
              <h2>{registeredEvents.length} events joined</h2>
            </div>
          </div>

          {registeredEvents.length === 0 ? (
            <p className="empty-state">You have not registered for any events yet. Use the buttons below to join one.</p>
          ) : (
            <div className="event-grid">
              {registeredEvents.map((event) => (
                <EventCard key={event.id} event={getEventSummary(event)} />
              ))}
            </div>
          )}
        </section>
      )}

      {isClub && (
        <section className="content-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Hosted events</p>
              <h2>Your event performance</h2>
            </div>
            <Link to="/club/add" reloadDocument className="btn btn-secondary">
              Create new event
            </Link>
          </div>

          {hostedEvents.length === 0 ? (
            <p className="empty-state">No events created yet. Add your first event to start receiving registrations.</p>
          ) : (
            <div className="event-grid">
              {hostedEvents.map((event) => (
                <EventCard key={event.id} event={getEventSummary(event)} registrantsVisible />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="content-panel" id="all-events">
        <div className="section-head">
          <div>
            <p className="eyebrow">Campus events</p>
            <h2>All upcoming events</h2>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Loading events…</p>
        ) : enrichedEvents.length === 0 ? (
          <p className="empty-state">No events are available yet.</p>
        ) : (
          <div className="event-grid">
            {enrichedEvents.map((event) => {
              const registered = isStudent ? isUserRegisteredForEvent(event.id, user.id) : false;

              return (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUser={user}
                  onPrimaryAction={isStudent ? () => handleRegister(event.id) : null}
                  primaryActionLabel={isStudent ? (registered ? "Registered" : "Register") : "View"}
                  primaryActionDisabled={registered}
                />
              );
            })}
          </div>
        )}
      </section>

      {isStudent && (
        <section className="content-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Recommended</p>
              <h2>Events matched to your interests</h2>
            </div>
          </div>

          {recommended.length === 0 ? (
            <p className="empty-state">Add more interests to improve your recommendations.</p>
          ) : (
            <div className="event-grid">
              {recommended.map((event) => (
                <EventCard
                  key={event.id}
                  event={getEventSummary(event)}
                  currentUser={user}
                  onPrimaryAction={() => handleRegister(event.id)}
                  primaryActionLabel="Register"
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Home;
