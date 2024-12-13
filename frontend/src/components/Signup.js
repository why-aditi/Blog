import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    const payload = { username, email, password };
    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result); // Debug: Ensure `userid` is in the response

        const access_token = result.access_token;
        const userId = result.userid; // Extract `userid`

        if (!userId) {
          console.error("User ID is undefined in the response!");
          setError("User ID is missing. Please try again.");
          return;
        }

        // Store the access token
        window.localStorage.setItem("access_token", access_token);

        setSuccessMessage(result.message || "Signup successful!");

        // Redirect to the dashboard with the userId
        navigate(`/dashboard/${userId}`);
      } else {
        const errorResult = await response.json();

        setError(errorResult.message || "An error occurred during signup.");
      }
    } catch (error) {
      setError("An error occurred while processing the request.");
    }
  };

  return (
    <div className="card">
      <form action="" className="form">
        <p className="sgnup">Sign Up to continue</p>
        <button className="oauthButton">
          <svg className="icon" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            ></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            ></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            ></path>
            <path d="M1 1h22v22H1z" fill="none"></path>
          </svg>
          Continue with Google
        </button>
        <div className="separator">
          <div></div>
          <span>OR</span>
          <div></div>
        </div>
        <input
          type="username"
          placeholder="Username"
          name="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Repeat Password"
          name="repeat password"
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <button className="oauthButton" onClick={handleSubmit}>
          Continue
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 17 5-5-5-5"></path>
            <path d="m13 17 5-5-5-5"></path>
          </svg>
        </button>
        <div className="alert-container">
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
        </div>
        <p className="no-acc">
          Don't have an account?{" "}
          <Link to="/signup" className="fw-bold">
            Signup here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
