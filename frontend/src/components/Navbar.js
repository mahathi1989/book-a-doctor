import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationAPI } from "../utils/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user) {
      notificationAPI.getAll().then((res) => {
        setUnread(res.data.filter((n) => !n.isRead).length);
      }).catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="fas fa-stethoscope me-2"></i>BookADoctor
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light text-primary fw-semibold px-3" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                {user.role === "patient" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/appointments">My Appointments</Link>
                  </li>
                )}
                {user.role === "doctor" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor/appointments">My Appointments</Link>
                  </li>
                )}
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin Panel</Link>
                  </li>
                )}
                <li className="nav-item position-relative">
                  <Link className="nav-link" to="/notifications">
                    <i className="fas fa-bell"></i>
                    {unread > 0 && (
                      <span className="badge bg-danger rounded-pill ms-1">{unread}</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button className="btn btn-light text-primary dropdown-toggle fw-semibold" data-bs-toggle="dropdown">
                    <i className="fas fa-user-circle me-1"></i>{user.name}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
