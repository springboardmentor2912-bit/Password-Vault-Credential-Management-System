import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const sendOtp = async () => {

        if (!email.trim()) {

            alert("Please enter your email");

            return;

        }

        try {

            const response = await api.post(
                "/password/forgot",
                {
                    email: email.trim()
                }
            );

            alert(
                response.data?.message ||
                response.data ||
                "OTP sent successfully"
            );

            navigate("/verify-otp", {
                state: {
                    email: email.trim()
                }
            });

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            if (error.response) {

                alert(
                    error.response.data?.message ||
                    error.response.data ||
                    "Failed to send OTP"
                );

            } else {

                alert(
                    "Unable to connect to SecureVault server."
                );

            }

        }

    };

    return (

        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#1e3c72,#2a5298)"
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

                        <h1>📧</h1>

                        <h2 className="fw-bold">
                            Forgot Password
                        </h2>

                        <p className="text-muted">
                            Enter your registered email to receive an OTP.
                        </p>

                    </div>

                    <div className="mb-4">

                        <label className="fw-semibold">
                            Email Address
                        </label>

                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <button
                        className="btn btn-primary btn-lg w-100"
                        onClick={sendOtp}
                    >
                        📩 Send OTP
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

export default ForgotPassword;