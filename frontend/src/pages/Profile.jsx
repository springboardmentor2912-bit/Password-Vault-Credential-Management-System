import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Profile() {

    const [user, setUser] = useState({
        username: "",
        email: ""
    });

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const email = localStorage.getItem("email");

            const response = await api.get(
                `/auth/profile?email=${email}`
            );

            setUser(response.data);

        } catch (error) {

            console.log(error);

            alert("Unable to Load Profile");

        }

    };

    return (

        <>
            <Navbar />

            <div className="container mt-5">

                <div className="row justify-content-center">

                    <div className="col-md-6">

                        <div className="card shadow-lg p-4 rounded-4">

                            <h2 className="mb-4">
                                My Profile
                            </h2>

                            <div className="mb-3">

                                <label className="form-label fw-bold">
                                    Username
                                </label>

                                <input
                                    className="form-control"
                                    value={user.username}
                                    readOnly
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label fw-bold">
                                    Email
                                </label>

                                <input
                                    className="form-control"
                                    value={user.email}
                                    readOnly
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );
}

export default Profile;