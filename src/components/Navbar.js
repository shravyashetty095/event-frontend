import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="app-navbar">
      <div className="container nav-inner">
        <div className="nav-left">
          <NavLink to="/home" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>

          {/* only show Add Event to club users */}
          {user && user.role === "club" && (
            <NavLink to="/add" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Add Event
            </NavLink>
          )}
        </div>

        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}