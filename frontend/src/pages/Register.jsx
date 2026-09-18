import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const password = form.password;

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const allRequirementsMet =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.special;

  let strength = "weak";

  if (allRequirementsMet && password.length >= 12) {
    strength = "strong";
  } else if (allRequirementsMet) {
    strength = "medium";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!allRequirementsMet) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser(form);
      localStorage.setItem("token", res.data.token);
      navigate("/login");
    } catch (err) {
      if (!err.response) {
        setError(
          "Unable to connect to server. Please try again later."
        );
      } else if (err.response.status === 400) {
        setError(
          err.response.data?.message ||
            "Invalid registration details. Please check your information."
        );
      } else if (err.response.status === 409) {
        setError(
          err.response.data?.message ||
            "An account with this email already exists."
        );
      } else {
        setError(
          err.response.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>

        <p className="auth-subtitle">
          Start managing your credentials securely
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full name</label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {password.length > 0 && (
            <div className="password-strength">
              <div className={`strength-text ${strength}`}>
                Password strength:{" "}
                {strength.charAt(0).toUpperCase() + strength.slice(1)}
              </div>

              <div className="strength-bar">
                <div
                  className={`strength-progress ${strength}`}
                ></div>
              </div>

              <div className="password-requirements">
                <p
                  className={
                    passwordChecks.length ? "valid" : "invalid"
                  }
                >
                  {passwordChecks.length ? "✓" : "✗"} At least 8 characters
                </p>

                <p
                  className={
                    passwordChecks.uppercase ? "valid" : "invalid"
                  }
                >
                  {passwordChecks.uppercase ? "✓" : "✗"} Uppercase letter
                </p>

                <p
                  className={
                    passwordChecks.lowercase ? "valid" : "invalid"
                  }
                >
                  {passwordChecks.lowercase ? "✓" : "✗"} Lowercase letter
                </p>

                <p
                  className={
                    passwordChecks.number ? "valid" : "invalid"
                  }
                >
                  {passwordChecks.number ? "✓" : "✗"} Number
                </p>

                <p
                  className={
                    passwordChecks.special ? "valid" : "invalid"
                  }
                >
                  {passwordChecks.special ? "✓" : "✗"} Special character
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !allRequirementsMet}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;