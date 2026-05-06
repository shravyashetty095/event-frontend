import React from "react";

export default function Header() {
  return (
    <header className="app-header">
      <div className="container header-inner">
        <div>
          <h1 className="app-title">EventSync</h1>
          <p className="app-tagline">A local-storage event platform for students and clubs</p>
        </div>
      </div>
    </header>
  );
}