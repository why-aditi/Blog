import React, { useState } from "react";
import "../styles/Navigation.css";
import { Link } from "react-router-dom"; // Use this Link for route navigation
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Navigation({ user }) {
  const [menuActive, setmenuActive] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="site-navigation">
      <span className="site-title">UrbanInk</span>
      <div className={`site-content ${menuActive && "active"}`}>
        <ul>
          {/* Use RouterLink for home navigation */}
          <li className="nav-item">
            <Link
              to="/"
              className="nav-link"
              style={{ cursor: "pointer" }}
              onClick={scrollToTop}
            >
              Home
            </Link>
          </li>

          {/* Use ScrollLink for smooth scroll to blog section */}
          <li className="nav-item">
            <Link
              to="/blog"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="nav-link"
              style={{ cursor: "pointer" }}
            >
              Blog
            </Link>
          </li>

          {/* Use RouterLink for login page navigation */}
          <li className="nav-item">
            <Link
              to="/login"
              className="nav-link"
              style={{ cursor: "pointer" }}
            >
              Login
            </Link>
          </li>
        </ul>
        <span className="account">
          <AccountCircleIcon style={{ fontSize: 45 }} />
          <span className="name">
            {user.first} {user.last}
          </span>
        </span>
      </div>
      <ion-icon
        name="menu-outline"
        className="menu-outline"
        onClick={() => setmenuActive(!menuActive)}
      ></ion-icon>
    </nav>
  );
}
