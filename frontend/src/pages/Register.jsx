import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/auth/register", formData);

            alert("Registration Successful");

            navigate("/");

        } catch (error) {

            alert(error.response?.data || "Registration Failed");

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

                        <h1>📝</h1>

                        <h2 className="fw-bold">

                            Create Account

                        </h2>

                        <p className="text-muted">

                            Join SecureVault today

                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="fw-semibold">

                                Username

                            </label>

                            <input
                                type="text"
                                name="username"
                                className="form-control form-control-lg"
                                placeholder="Enter Username"
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="fw-semibold">

                                Email

                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-lg"
                                placeholder="Enter Email"
                                onChange={handleChange}
                                required
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
                                    name="password"
                                    className="form-control form-control-lg"
                                    placeholder="Enter Password"
                                    onChange={handleChange}
                                    required
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
                            type="submit"
                        >

                            Register

                        </button>

                    </form>

                    <hr />

                    <div className="text-center">

                        <p>

                            Already have an account?

                        </p>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate("/")}
                        >

                            Login

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;