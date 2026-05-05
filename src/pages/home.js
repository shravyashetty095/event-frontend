// ...existing code...
import { useEffect, useState } from "react";
import api from "../api";
import EventCard from "../components/eventcard";
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  // fetchEvents defined before useEffect to avoid TDZ / reference errors
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events");
      const all = res.data || [];
      setEvents(all);

      if (user && user.role === "student" && Array.isArray(user.interests)) {
        const rec = all.filter((ev) =>
          Array.isArray(ev.tags) && ev.tags.some((tag) => user.interests.includes(tag))
        );
        setRecommended(rec);
      } else {
        setRecommended([]);
      }
    } catch (err) {
      console.error("Failed to load events", err);
      setEvents([]);
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = async (eventId) => {
    if (!user) {
      alert("Please login to register.");
      navigate("/");
      return;
    }
    try {
      await api.post("/register", { userId: user._id, eventId });
      alert("Registered successfully!");
      // optionally refresh events or registrations here
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const isStudent = user && user.role === "student";
  const isClub = user && user.role === "club";

  return (
    <main className="container mt-4">
      <section className="home-hero card">
        <div className="hero-left">
          <h1 className="hero-title">
            {isStudent
              ? `Welcome${user && user.name ? `, ${user.name}` : ""} — discover events you'll love`
              : isClub
              ? `Welcome${user && user.name ? `, ${user.name}` : ""} — manage your club events`
              : "Welcome to EventSystem"}
          </h1>

          <p className="hero-sub">
            {isStudent
              ? "Curated campus events, simple registration and personalised recommendations based on your interests."
              : isClub
              ? "Create, manage and promote events to reach students across the campus."
              : "Discover and join campus activities."}
          </p>

          {isStudent && Array.isArray(user?.interests) && user.interests.length > 0 && (
            <div className="interest-chips" aria-hidden>
              {user.interests.map((it) => (
                <span key={it} className="chip">
                  {it}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="hero-right">
          <div className="stats">
            <div className="stat">
              <div className="stat-value">{events.length}</div>
              <div className="stat-label">Events</div>
            </div>
            <div className="stat">
              <div className="stat-value">{recommended.length}</div>
              <div className="stat-label">Recommended</div>
            </div>
          </div>

          {isClub ? (
            <Link to="/add" className="btn primary hero-cta">
              Add Event
            </Link>
          ) : (
            <button className="btn ghost hero-cta" onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}>
              Browse Events
            </button>
          )}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="section-title">All Events</h2>

        {loading ? (
          <p className="muted">Loading events…</p>
        ) : events.length === 0 ? (
          <div className="placeholder card">
            <h3>No events yet</h3>
            <p className="muted">
              Follow clubs or ask admins to add events. {isClub ? "Use the button above to create one." : "Check back later or contact clubs for upcoming events."}
            </p>
            {isClub && (
              <button className="btn primary" onClick={() => navigate("/add")}>
                Create Event
              </button>
            )}
          </div>
        ) : (
          <div className="event-list">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRegister={isStudent ? () => handleRegister(event._id) : null}
              />
            ))}
          </div>
        )}
      </section>

      {isStudent && (
        <section className="mt-5">
          <h2 className="section-title">Recommended for you</h2>
          {recommended.length === 0 ? (
            <p className="muted">No recommendations yet — update your interests to get better matches.</p>
          ) : (
            <div className="event-list">
              {recommended.map((event) => (
                <EventCard key={event._id} event={event} onRegister={() => handleRegister(event._id)} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Home;
