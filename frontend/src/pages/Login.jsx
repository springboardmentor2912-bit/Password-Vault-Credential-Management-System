import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            alert(response.data.message);

            localStorage.setItem(
                "email",
                response.data.email
            );

            localStorage.setItem(
                "username",
                response.data.username
            );

            navigate("/dashboard");

        } catch (error) {

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Login Failed"
                );

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
                background:
                    "linear-gradient(135deg,#1e3c72,#2a5298)"
            }}
        >

            <div
                className="card shadow-lg border-0"
                style={{
                    width: "420px",
                    borderRadius: "20px"
                }}
            >

                <div className="card-body p-5">

                    <div className="text-center mb-4">

                        <h1>🔐</h1>

                        <h2 className="fw-bold">

                            SecureVault

                        </h2>

                        <p className="text-muted">

                            Secure Password Management

                        </p>

                    </div>

                    <div className="mb-3">

                        <label className="fw-semibold">

                            Email

                        </label>

                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-4">

                        <label className="fw-semibold">

                            Password

                        </label>

                        <div className="input-group">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                className="form-control form-control-lg"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {showPassword
                                    ? "🙈"
                                    : "👁"}

                            </button>

                        </div>

                    </div>

                    <button
                        className="btn btn-primary btn-lg w-100"
                        onClick={handleLogin}
                    >

                        Login

                    </button>

                    <div className="text-center mt-4">

                        <button
                            className="btn btn-link text-decoration-none"
                            onClick={() =>
                                navigate("/forgot-password")
                            }
                        >

                            Forgot Password?

                        </button>

                    </div>

                    <hr />

                    <div className="text-center">

                        <p>

                            Don't have an account?

                        </p>

                        <button
                            className="btn btn-success w-100"
                            onClick={() =>
                                navigate("/register")
                            }
                        >

                            Create Account

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;