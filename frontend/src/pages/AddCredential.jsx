import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AddCredential() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [credential, setCredential] = useState({
        website: "",
        username: "",
        password: "",
        category: "",
        favourite: false
    });

    const [strength, setStrength] = useState("");

    const checkStrength = (password) => {

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[@#$%&*!?]/.test(password)) score++;

        if (score <= 2)
            setStrength("Weak");
        else if (score <= 4)
            setStrength("Medium");
        else
            setStrength("Strong");
    };

    const generatePassword = () => {

        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const special = "@#$%&*!?";
        const all = upper + lower + numbers + special;

        let password = "";

        password += upper[Math.floor(Math.random() * upper.length)];
        password += lower[Math.floor(Math.random() * lower.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];

        for (let i = 4; i < 12; i++) {

            password += all[Math.floor(Math.random() * all.length)];

        }

        password = password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");

        setCredential({
            ...credential,
            password: password
        });

        checkStrength(password);
    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setCredential({
            ...credential,
            [name]: type === "checkbox" ? checked : value
        });

        if (name === "password") {

            checkStrength(value);

        }

    };

    const saveCredential = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                `/credentials?email=${email}`,
                credential
            );

            alert("Credential Saved Successfully");

            navigate("/credentials");

        } catch (error) {

            console.log(error);

            alert("Unable to Save Credential");

        }

    };

    return (

        <>

            <Navbar />

            <div className="container mt-4">

                <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/dashboard")}
                >
                    🏠 Dashboard
                </button>

            </div>

            <div className="container mt-4">

                <div className="row justify-content-center">

                    <div className="col-md-7">

                        <div className="card shadow-lg p-4 rounded-4">

                            <h2 className="mb-4">
                                Add Credential
                            </h2>

                            <form onSubmit={saveCredential}>

                                <div className="mb-3">

                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Website Name"
                                        name="website"
                                        value={credential.website}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Username / Email"
                                        name="username"
                                        value={credential.username}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <div className="input-group">

                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="Password"
                                            name="password"
                                            value={credential.password}
                                            onChange={handleChange}
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={generatePassword}
                                        >
                                            Generate Password
                                        </button>

                                    </div>

                                </div>

                                {strength && (

                                    <div className="mb-3">

                                        <strong>Password Strength : </strong>

                                        <span
                                            className={
                                                strength === "Strong"
                                                    ? "text-success"
                                                    : strength === "Medium"
                                                        ? "text-warning"
                                                        : "text-danger"
                                            }
                                        >
                                            {strength}
                                        </span>

                                    </div>

                                )}

                                <div className="mb-3">

                                    <select
                                        className="form-select form-select-lg"
                                        name="category"
                                        value={credential.category}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select Category
                                        </option>

                                        <option>Social</option>
                                        <option>Banking</option>
                                        <option>Work</option>
                                        <option>Shopping</option>
                                        <option>Education</option>
                                        <option>Entertainment</option>
                                        <option>Other</option>

                                    </select>

                                </div>

                                <div className="form-check mb-4">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="favourite"
                                        checked={credential.favourite}
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        ⭐ Mark as Favourite
                                    </label>

                                </div>

                                <button
                                    className="btn btn-dark btn-lg"
                                    type="submit"
                                >
                                    Save Credential
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}

export default AddCredential;