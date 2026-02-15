import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/app/dashboard");
    } catch (err) {
      setError("Google login failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="badge">E-Dr</div>
        <h1>Community Health Login</h1>
        <p>Access early warning checks for water-borne diseases.</p>
        <div className="login-actions">
          <button className="btn primary" onClick={handleGoogleLogin} type="button">
            Continue with Google
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Login;
