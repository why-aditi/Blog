import React, { useState } from "react";
import "../styles/Navigation.css";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const navLinks = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Blog",
    path: "/blog",
  },
  {
    title: "Contact Us",
    path: "/contact-us",
  },
  {
    title: "Login",
    path: "/login",
  },
];

export default function Navigation({ user }) {
  const [menuActive, setmenuActive] = useState(false);
  return (
    <nav className="site-navigation">
      <span className="site-title">UrbanInk</span>
      <div className={`site-content ${menuActive && "active"}`}>
        <ul>
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.path}>{link.title}</Link>
            </li>
          ))}
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
