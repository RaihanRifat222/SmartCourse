import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <header className="nav-header">
      <div className="nav-brand">
        <span className="brand-mark">SC</span>
        <div>
          <p className="brand-title">SmartCourse AI</p>
          <p className="brand-subtitle">Curriculum generator</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link${isActive ? " nav-link-active" : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `nav-link${isActive ? " nav-link-active" : ""}`
          }
        >
          Courses
        </NavLink>
      </nav>
    </header>
  );
}

export default NavBar;
