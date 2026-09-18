import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleReset = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    alert("Password Reset Successfully");

    navigate("/");
  };

  return (
    <div className="reset-container">

      <div className="reset-card">

        <h2>Reset Password</h2>

        <p>{email}</p>

        <form onSubmit={handleReset}>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPassword;