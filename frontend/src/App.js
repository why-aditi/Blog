import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import "./App.css";
import Home from "./components/home";
import Login from "./components/login";
import Blog from "./components/blog";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

const user = {
  first: "Aditi",
  last: "Kala",
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/:userid" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
