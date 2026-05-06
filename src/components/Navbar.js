import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, signOutAccount } from "../utils/storage";

export default function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOutAccount();
    navigate("/");
  };

  return (
    <nav className="app-navbar">
      <div className="container nav-inner">
        <div className="nav-left">
          <NavLink to={user ? (user.role === "club" ? "/club" : "/student") : "/"} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>

          {user && user.role === "club" && (
            <Link to="/club/add" reloadDocument className="nav-link nav-link-button">
              Add Event
            </Link>
          )}
        </div>

        <div className="nav-right">
          {user && <span className="nav-user">{user.name} · {user.role}</span>}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}