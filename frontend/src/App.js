import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import "./App.css";
import Home from "./components/home";
import Login from "./components/login";
import Blog from "./components/blog";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
