import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    localStorage.removeItem("edr_token");
    localStorage.removeItem("edr_user");
    try {
      await logout();
    } finally {
      window.location.replace("/");
    }
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <div className="brand-mark">E-Dr</div>
          <div>
            <div className="brand-title">Smart Health Monitor</div>
            <div className="brand-subtitle">Community early warning system</div>
          </div>
        </div>
        <div className="top-actions">
          <span className="user-chip">{user?.name || "User"}</span>
          <button className="btn ghost" onClick={handleSignOut} type="button">
            Sign out
          </button>
        </div>
      </header>
      <div className="content-shell">
        <nav className="side-nav">
          <Link className={location.pathname.includes("dashboard") ? "active" : ""} to="/app/dashboard">
            Dashboard
          </Link>
          <Link className={location.pathname.includes("health-check") ? "active" : ""} to="/app/health-check">
            Health Check
          </Link>
          {user?.role === "admin" && (
            <>
              <Link className={location.pathname.includes("admin") ? "active" : ""} to="/app/admin">
                Admin Panel
              </Link>
              <Link className={location.pathname.includes("analytics") ? "active" : ""} to="/app/analytics">
                Analytics
              </Link>
            </>
          )}
        </nav>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
