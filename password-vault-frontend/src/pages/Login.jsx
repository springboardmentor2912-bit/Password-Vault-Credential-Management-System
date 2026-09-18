import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "https://securevault-osrq.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Login Response:", response.data);

      // Save JWT token
      localStorage.setItem(
        "token",
        response.data.token
      );

      console.log("Token saved successfully");

      alert("Login Successful");

      // Open Dashboard after login
      navigate("/dashboard");

    } catch (error) {

      console.log("LOGIN ERROR:", error);

      if (error.response) {

        console.log(
          "Status:",
          error.response.status
        );

        console.log(
          "Response:",
          error.response.data
        );

        // Wrong email or password
        if (
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          alert("Incorrect email or password.");
        }

        // Email not registered
        else if (error.response.status === 404) {
          alert("Email not registered.");
        }

        // Other error
        else {
          alert(
            "Login failed. Please try again."
          );
        }

      } else {

        alert(
          "Unable to connect to server."
        );
      }
    }
  };

  return (

    <div className="login-container">

      <div className="login-card">

        <div className="logo">
          <FaShieldAlt />
        </div>

        <h1>Password Vault</h1>

        <p>
          Secure Credential Management System
        </p>

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="input-box">

            <FaEnvelope className="icon" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="input-box">

            <FaLock className="icon" />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          {/* OPTIONS */}

          <div className="options">

            <label>

              <input type="checkbox" />

              Remember Me

            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-btn"
          >
            Login Securely
          </button>

        </form>

        {/* REGISTER */}

        <p className="register">

          Don't have an account?

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;