import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./index.css"; // Import the CSS file

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "/register" : "/login";

    try {
      const res = await axios.post(
        `http://localhost:3000/api/users${endpoint}`,
        {
          username,
          password,
        }
      );

      if (isRegistering) {
        toast.success("Registration successful! Please login.");
        setIsRegistering(false);
      } else {
        toast.success("Welcome back!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);

        // Now call the parent
        if (onLogin) onLogin(res.data.token, res.data.username);

        // Navigate to Dashboard
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{isRegistering ? "Register" : "Login"}</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />

          <button type="submit" className="login-btn">
            {isRegistering ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="login-footer">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}
          <span
            onClick={() => setIsRegistering(!isRegistering)}
            className="login-link"
          >
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
