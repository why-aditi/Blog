import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import "./App.css";
import PageRenderer from "./PageRenderer";

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
          <Route path="/:page" element={<PageRenderer />} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
