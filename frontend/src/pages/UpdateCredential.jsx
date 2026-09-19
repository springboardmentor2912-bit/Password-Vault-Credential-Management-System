import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function UpdateCredential() {

    const { id } = useParams();
    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [credential, setCredential] = useState({
        website: "",
        username: "",
        password: "",
        category: "",
        favourite: false
    });

    useEffect(() => {
        loadCredential();
    }, []);

    const loadCredential = async () => {

        try {

            const response = await api.get(
                `/credentials?email=${encodeURIComponent(email)}`
            );

            const selected = response.data.find(
                c => c.id === Number(id)
            );

            if (selected) {
                setCredential(selected);
            } else {
                alert("Credential not found or you do not have access");
                navigate("/credentials");
            }

        } catch (error) {

            console.log(error);

            alert("Failed to load credential");

        }

    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setCredential({
            ...credential,
            [name]: type === "checkbox"
                ? checked
                : value
        });

    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            /*
             * Backend requires the user's email as a request parameter.
             *
             * PUT:
             * /api/credentials/{id}?email={email}
             */
            await api.put(
                `/credentials/${id}?email=${encodeURIComponent(email)}`,
                credential
            );

            alert("Credential Updated Successfully");

            navigate("/credentials");

        } catch (error) {

            console.log("Update Error:", error);

            if (error.response) {

                alert(
                    error.response.data ||
                    "You do not have permission to update this credential"
                );

            } else {

                alert("Update Failed");

            }

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
                                Update Credential
                            </h2>

                            <form onSubmit={handleUpdate}>

                                {/* Website */}
                                <div className="mb-3">

                                    <input
                                        className="form-control"
                                        name="website"
                                        value={credential.website}
                                        onChange={handleChange}
                                        placeholder="Website"
                                        autoComplete="url"
                                        required
                                    />

                                </div>

                                {/* Username */}
                                <div className="mb-3">

                                    <input
                                        className="form-control"
                                        name="username"
                                        value={credential.username}
                                        onChange={handleChange}
                                        placeholder="Username"
                                        autoComplete="username"
                                        required
                                    />

                                </div>

                                {/* Password */}
                                <div className="mb-3">

                                    <input
                                        className="form-control"
                                        type="text"
                                        name="password"
                                        value={credential.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        autoComplete="new-password"
                                        required
                                    />

                                </div>

                                {/* Category */}
                                <div className="mb-3">

                                    <select
                                        className="form-select"
                                        name="category"
                                        value={credential.category}
                                        onChange={handleChange}
                                    >

                                        <option value="Social">
                                            Social
                                        </option>

                                        <option value="Banking">
                                            Banking
                                        </option>

                                        <option value="Work">
                                            Work
                                        </option>

                                        <option value="Shopping">
                                            Shopping
                                        </option>

                                        <option value="Education">
                                            Education
                                        </option>

                                        <option value="Entertainment">
                                            Entertainment
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                                {/* Favourite */}
                                <div className="form-check mb-4">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="favourite"
                                        name="favourite"
                                        checked={credential.favourite}
                                        onChange={handleChange}
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="favourite"
                                    >
                                        ⭐ Favourite
                                    </label>

                                </div>

                                {/* Update button */}
                                <button
                                    className="btn btn-dark"
                                    type="submit"
                                >
                                    Update Credential
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default UpdateCredential;