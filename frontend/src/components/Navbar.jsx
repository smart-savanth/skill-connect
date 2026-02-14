// components/Navbar.js
import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserFriends, FaUsers, FaUserPlus } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          <FaUserFriends className="logo-icon" />
          <span>Community</span>
        </NavLink>

        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaUsers className="nav-icon" />
            Browse Profiles
          </NavLink>
          <NavLink
            to="/submit"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaUserPlus className="nav-icon" />
            Add Profile
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
