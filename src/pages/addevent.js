
import { useState } from "react";
import api from "../api";

import { useNavigate } from "react-router-dom";

function AddEvent() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await api.post("/add-event", {
        title,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        date,
        club: "Club",
      });
      alert("Event Added!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Failed to add event");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Event</h2>

      <input
        className="form-control mb-2"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Tags (AI, Coding, Music)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <input
        className="form-control mb-2"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button className="btn primary" onClick={handleAdd}>
        Add Event
      </button>
    </div>
  );
}

export default AddEvent;
