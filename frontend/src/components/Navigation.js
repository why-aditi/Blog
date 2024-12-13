import React, { useState } from "react";
import "../styles/Navigation.css";
import { Link } from "react-router-dom"; // Use this Link for route navigation
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

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

          <li className="nav-item">
            <Link
              to="/blog"
              offset={-70}
              duration={500}
              className="nav-link"
              style={{ cursor: "pointer" }}
            >
              Blog
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/login"
              className="nav-link"
              style={{ cursor: "pointer" }}
            >
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/signup"
              className="nav-link"
              style={{ cursor: "pointer" }}
            >
              Signup
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
      <div className="menu-icon" onClick={() => setmenuActive(!menuActive)}>
        {menuActive ? (
          <CloseIcon style={{ fontSize: 36, cursor: "pointer" }} />
        ) : (
          <MenuIcon style={{ fontSize: 36, cursor: "pointer" }} />
        )}
      </div>
    </nav>
  );
}
