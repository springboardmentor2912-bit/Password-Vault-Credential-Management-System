import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await resetPassword({
        email,
        otp,
        newPassword,
      });

      alert(response.data);

      navigate("/");

    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Reset Password
        </button>

      </form>
    </div>
  );
}

export default ResetPassword;