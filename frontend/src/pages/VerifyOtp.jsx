import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/api";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await verifyOtp({
        email,
        otp,
      });

      alert(response.data);

      navigate("/reset-password", {
        state: { email, otp },
      });

    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Verify OTP</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Verify OTP
        </button>

      </form>
    </div>
  );
}

export default VerifyOtp;