import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShieldAlt } from "react-icons/fa";
import "./VerifyOTP.css";

function VerifyOTP() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const verifyOTP = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "https://securevault-osrq.onrender.com/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      alert(response.data);

      navigate("/reset-password", {
        state: {
          email,
        },
      });

    } catch (error) {

      alert("Invalid OTP");

    }

  };

  return (

    <div className="verify-container">

      <div className="verify-card">

        <div className="verify-icon">
          <FaShieldAlt />
        </div>

        <h2>Verify OTP</h2>

        <p>

          Enter the OTP sent to

          <br />

          <strong>{email}</strong>

        </p>

        <form onSubmit={verifyOTP}>

          <input

            type="text"

            placeholder="Enter 6 Digit OTP"

            maxLength={6}

            value={otp}

            onChange={(e) => setOtp(e.target.value)}

            required

          />

          <button type="submit">

            Verify OTP

          </button>

        </form>

      </div>

    </div>

  );

}

export default VerifyOTP;