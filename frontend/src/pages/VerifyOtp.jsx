import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtp() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {

    try {

      const response = await axios.post(
        "/api/password/verify",
        {
          email: email,
          otp: otp
        }
      );

      alert(response.data);

      navigate("/reset-password", {
        state: {
          email: email
        }
      });

    } catch (error) {

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Server not running");
      }

    }

  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow p-4">

            <h2 className="text-center mb-4">
              Verify OTP
            </h2>

            <div className="mb-3">

              <label>Email</label>

              <input
                type="email"
                className="form-control"
                value={email}
                readOnly
              />

            </div>

            <div className="mb-3">

              <label>OTP</label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

            </div>

            <button
              className="btn btn-primary w-100"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default VerifyOtp;