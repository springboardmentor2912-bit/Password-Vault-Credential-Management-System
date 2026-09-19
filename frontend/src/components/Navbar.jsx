import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("email");
        localStorage.removeItem("username");

        navigate("/");

    };

    return (

        <nav
            className="navbar navbar-expand-lg bg-white border-bottom shadow-sm"
            style={{
                padding: "14px 30px"
            }}
        >

            <div className="container-fluid">

                {/* Logo */}
                <Link
                    className="navbar-brand fw-bold fs-3 text-primary"
                    to="/dashboard"
                    style={{
                        letterSpacing: "0.3px"
                    }}
                >
                    SecureVault
                </Link>

                {/* Mobile Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                >

                    <ul className="navbar-nav ms-auto align-items-lg-center">

                        {/* Dashboard */}
                        <li className="nav-item me-lg-3">

                            <Link
                                className="nav-link fw-semibold text-secondary"
                                to="/dashboard"
                            >
                                Dashboard
                            </Link>

                        </li>

                        {/* Credentials */}
                        <li className="nav-item dropdown me-lg-3">

                            <a
                                className="nav-link dropdown-toggle fw-semibold text-secondary"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Credentials
                            </a>

                            <ul className="dropdown-menu dropdown-menu-end shadow-sm">

                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/add-credential"
                                    >
                                        Add Credential
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/credentials"
                                    >
                                        View Credentials
                                    </Link>
                                </li>

                            </ul>

                        </li>

                        {/* Profile */}
                        <li className="nav-item me-lg-3">

                            <Link
                                className="nav-link fw-semibold text-secondary"
                                to="/profile"
                            >
                                Profile
                            </Link>

                        </li>

                        {/* Logout */}
                        <li className="nav-item mt-2 mt-lg-0">

                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm px-4"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;