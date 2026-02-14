// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ProfileSubmission from "./pages/ProfileSubmission";
import ProfilesList from "./components/ProfilesList";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProfilesList />} />
            <Route path="/submit" element={<ProfileSubmission />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
