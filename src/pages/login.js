import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // "student" or "club"
  const [interests, setInterests] = useState("");
  const [clubInfo, setClubInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = {
      name,
      password,
      role,
      ...(role === "student" ? { interests: interests.split(",").map(s => s.trim()).filter(Boolean) } : { clubInfo })
    };

    try {
      const res = await api.post("/login", user);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/home");
    } catch (err) {
      console.error(err);
      // Add user-facing error handling as needed
    }
  };

  return (
    <div className="login-page container">
      <div className="login-card">
        <div className="role-toggle">
          <button
            className={`role-btn ${role === "club" ? "active" : ""}`}
            onClick={() => setRole("club")}
          >
            Club
          </button>
          <button
            className={`role-btn ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
        </div>

        <h2 className="login-title">{role === "student" ? "Student Login" : "Club Login"}</h2>

        <div className="input-pill">
          <span className="input-icon">✉️</span>
          <input
            type="text"
            placeholder={role === "student" ? "Enter Name / Student ID" : "Club Name / Email"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-pill">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />{" "}
          Show Password
        </label>

        {role === "student" ? (
          <input
            className="form-control mb-2 simple-input"
            placeholder="Interests (AI, Coding, Music)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        ) : (
          <input
            className="form-control mb-2 simple-input"
            placeholder="Short club description / code"
            value={clubInfo}
            onChange={(e) => setClubInfo(e.target.value)}
          />
        )}

        <button className="btn primary-cta" onClick={handleLogin}>
          LOGIN
        </button>
      </div>
    </div>
  );
}

export default Login;