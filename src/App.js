// ...existing code...
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import AddEvent from "./pages/addevent";
import "./styles.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === "/"; // hide navbar on login only

  return (
    <>
      <Header />
      {!hideNav && <Navbar />}
      <main style={{ paddingTop: 12 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add" element={<AddEvent />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;