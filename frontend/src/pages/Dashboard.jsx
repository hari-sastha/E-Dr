import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../state/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await api.get("/api/reports");
        setReports(response.data.reports || []);
      } catch (err) {
        setError("Unable to load reports.");
      }
    };

    loadReports();
  }, []);

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <h2>Welcome, {user?.name || "Friend"}</h2>
          <p>Start a new health check to detect early warning signs.</p>
        </div>
        <Link className="btn primary" to="/app/health-check">
          Start Health Check
        </Link>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>Previous Reports</h3>
          {error && <span className="error">{error}</span>}
        </div>
        {reports.length === 0 ? (
          <p className="muted">No reports yet. Start your first check.</p>
        ) : (
          <div className="report-list">
            {reports.map((report) => (
              <Link className="report-item" key={report._id} to={`/app/result/${report._id}`}>
                <div>
                  <div className="report-title">{report.result.diseaseName}</div>
                  <div className="report-date">
                    {new Date(report.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className={`pill ${report.result.severity}`}>{report.result.severity}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
