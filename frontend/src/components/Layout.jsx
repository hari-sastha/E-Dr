import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("edr_theme") || "light");

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("edr_theme", theme);
  }, [theme]);

  const handleSignOut = async () => {
    await logout();
    window.location.replace("/");
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <div className="brand-mark">EDR</div>
          <div>
            <div className="brand-title">Emergency Disease Response</div>
            <div className="brand-subtitle">Early detection and prevention platform</div>
          </div>
        </div>
        <div className="top-actions">
          <button
            className="btn ghost"
            onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            type="button"
          >
            {theme === "light" ? "Dark" : "Light"} Mode
          </button>
          <Link className="user-chip" to="/app/profile">
            {user?.name || "User"}
          </Link>
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
          <Link className={location.pathname.includes("water-safety") ? "active" : ""} to="/app/water-safety">
            Water Safety
          </Link>
          {user?.role === "admin" && (
            <Link className={location.pathname.includes("admin") ? "active" : ""} to="/app/admin">
              Admin Panel
            </Link>
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
