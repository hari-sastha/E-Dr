import React from "react";
import { Link } from "react-router-dom";

const Landing = () => (
  <div className="login-page">
    <div className="login-card">
      <div className="badge">E-Dr</div>
      <h1>Emergency Disease Response</h1>
      <p>
        Public health monitoring platform for early detection of waterborne disease risk,
        pollution alerts, and rapid medical response.
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
