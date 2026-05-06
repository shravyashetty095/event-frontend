import React from "react";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <small>© {new Date().getFullYear()} EventSync</small>
      </div>
    </footer>
  );
}