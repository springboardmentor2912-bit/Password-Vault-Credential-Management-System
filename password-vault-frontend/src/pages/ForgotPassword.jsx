import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "https://securevault-osrq.onrender.com/api/auth/forgot-password",
        {
          email: email
        }
      );

      alert(response.data);

      navigate("/verify-otp", {
        state: { email }
      });

    } catch (error) {

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Unable to connect to backend.");
      }

    }

  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">

        <h2>Forgot Password</h2>

        <p>Enter your registered email address.</p>

        <form onSubmit={handleSendOTP}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Send OTP
          </button>

        </form>

      </div>
    </div>
  );

}

export default ForgotPassword;