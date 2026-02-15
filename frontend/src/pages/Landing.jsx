import React from "react";
import { Link } from "react-router-dom";

const Landing = () => (
  <div className="login-page">
    <div className="login-card">
      <div className="badge">E-Dr</div>
      <h1>Smart Community Health Monitoring</h1>
      <p>
        Early warning system for water-borne diseases in rural Northeast India.
        Log in to start a health check and track reports.
      </p>
      <div className="row" style={{ justifyContent: "center" }}>
        <Link className="btn primary" to="/login">
          Get Started
        </Link>
      </div>
    </div>
  </div>
);

export default Landing;
