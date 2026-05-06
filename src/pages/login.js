import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAccount, signInAccount, getCurrentUser } from "../utils/storage";

function Login() {
  const [mode, setMode] = useState("sign-in");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [interests, setInterests] = useState("");
  const [clubInfo, setClubInfo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isRegisterMode = mode === "register";

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName || !password.trim()) {
      setError("Please fill in your name and password.");
      return;
    }

    try {
      if (isRegisterMode) {
        registerAccount({
          name: trimmedName,
          password: password.trim(),
          role,
          interests,
          clubInfo,
        });
      } else {
        signInAccount({
          name: trimmedName,
          password: password.trim(),
          role,
        });
      }

      const next = getCurrentUser();
      if (next && next.role === "club") {
        navigate("/club");
      } else {
        navigate("/student");
      }
    } catch (submissionError) {
      setError(submissionError.message || "Something went wrong.");
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-controls-top">
          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button type="button" className={`auth-tab ${!isRegisterMode ? "active" : ""}`} onClick={() => setMode("sign-in") }>
              Sign in
            </button>
            <button type="button" className={`auth-tab ${isRegisterMode ? "active" : ""}`} onClick={() => setMode("register") }>
              Register
            </button>
          </div>

          <div className="role-toggle">
          <button
            type="button"
            className={`role-btn ${role === "club" ? "active" : ""}`}
            onClick={() => setRole("club")}
          >
            Club
          </button>
          <button
            type="button"
            className={`role-btn ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          </div>
        </div>

        <div className="form-stack">
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              placeholder={role === "student" ? "Enter your name" : "Enter your club name"}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {isRegisterMode && role === "student" && (
            <label className="field">
              <span>Interests</span>
              <input
                type="text"
                placeholder="Coding, Music, Sports"
                value={interests}
                onChange={(event) => setInterests(event.target.value)}
              />
            </label>
          )}

          {isRegisterMode && role === "club" && (
            <label className="field">
              <span>Club description</span>
              <textarea
                rows="4"
                placeholder="A short description of your club and the kind of events you host"
                value={clubInfo}
                onChange={(event) => setClubInfo(event.target.value)}
              />
            </label>
          )}

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn-primary auth-submit" type="button" onClick={handleSubmit}>
            {isRegisterMode ? "Create account" : "Sign in"}
          </button>
        </div>

        <div className="auth-hint">
          <p>Use your own account details to continue.</p>
        </div>
      </section>
    </div>
  );
}

export default Login;