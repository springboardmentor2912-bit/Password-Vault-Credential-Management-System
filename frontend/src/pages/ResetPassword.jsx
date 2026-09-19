import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const resetPassword = async () => {

        if (!newPassword) {

            alert("Please enter a new password");

            return;

        }

        try {

            const response = await axios.post(
                "/api/password/reset",
                {
                    email,
                    newPassword
                }
            );

            alert(response.data);

            navigate("/");

        } catch (error) {

            if (error.response) {

                alert(error.response.data.message || error.response.data);

            } else {

                alert("Server not running");

            }

        }

    };

    return (

        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#1e3c72,#2a5298)"
            }}
        >

            <div
                className="card shadow-lg border-0"
                style={{
                    width: "450px",
                    borderRadius: "20px"
                }}
            >

                <div className="card-body p-5">

                    <div className="text-center mb-4">

                        <h1>🔑</h1>

                        <h2 className="fw-bold">

                            Reset Password

                        </h2>

                        <p className="text-muted">

                            Create a strong new password for your account.

                        </p>

                    </div>

                    <div className="mb-3">

                        <label className="fw-semibold">

                            Email Address

                        </label>

                        <input
                            type="email"
                            className="form-control form-control-lg"
                            value={email}
                            readOnly
                        />

                    </div>

                    <div className="mb-4">

                        <label className="fw-semibold">

                            New Password

                        </label>

                        <div className="input-group">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                className="form-control form-control-lg"
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>

                        </div>

                    </div>

                    <button
                        className="btn btn-success btn-lg w-100"
                        onClick={resetPassword}
                    >

                        🔄 Reset Password

                    </button>

                    <hr />

                    <button
                        className="btn btn-outline-secondary w-100"
                        onClick={() => navigate("/")}
                    >

                        ⬅ Back to Login

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ResetPassword;