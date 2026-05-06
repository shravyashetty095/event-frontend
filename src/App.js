import React from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import AddEvent from "./pages/addevent";
import "./styles.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getCurrentUser, initializeStorage } from "./utils/storage";

function AppContent() {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const hideNav = location.pathname === "/";

  return (
    <>
      <Header />
      {!hideNav && <Navbar />}
      <main className="app-main">
        <Routes>
          {/* Root: send signed-in users to their role landing */}
          <Route
            path="/"
            element={
              currentUser ? (
                <Navigate to={currentUser.role === "club" ? "/club" : "/student"} replace />
              ) : (
                <Login />
              )
            }
          />

          {/* Student landing */}
          <Route path="/student" element={currentUser && currentUser.role === "student" ? <Home /> : <Navigate to="/" replace />} />

          {/* Club landing */}
          <Route path="/club" element={currentUser && currentUser.role === "club" ? <Home /> : <Navigate to="/" replace />} />

          {/* Club add-event route: always mount so navigation renders; AddEvent will redirect if unauthorized */}
          <Route path="/club/add" element={<AddEvent />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  initializeStorage();

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;