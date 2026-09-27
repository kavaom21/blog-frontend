import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <Link to="/" className="brand">BlogSpace</Link>
            <div className="nav-links">
                {user?.role === "admin" && <Link to="/admin">Admin</Link>}
                {token ? (
                    <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}