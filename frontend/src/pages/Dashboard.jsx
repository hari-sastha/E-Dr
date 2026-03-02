import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import api from "../api/client";
import { useAuth } from "../state/AuthContext.jsx";

const normalizeStateKey = (value = "") =>
  value.toLowerCase().replace(/[\s_-]/g, "");

const getPollutionStatusLabel = (waterPollution) => {
  if (!waterPollution) return null;
  if (waterPollution.edibility === "EDIBLE") return "Good";
  if (waterPollution.edibility === "MODERATE") return "Moderate";
  return "Risk";
};

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        
        // Fetch user's health reports
        const reportsRes = await api.get("/api/reports");
        const reports = reportsRes.data.reports || [];
        
        // Get latest report
        const latestReport = reports.length > 0 ? reports[0] : null;
        
        // Fetch water pollution data for user's state
        let waterPollution = null;
        if (user?.state) {
          try {
            const waterRes = await api.get(`/api/water-pollution/state/${encodeURIComponent(user.state)}`);
            waterPollution = waterRes.data.data;
          } catch (err) {
            try {
              const allStatesRes = await api.get("/api/water-pollution");
              const allStatesData = allStatesRes.data.data || [];
              const match = allStatesData.find(
                (item) => normalizeStateKey(item.state) === normalizeStateKey(user.state)
              );
              waterPollution = match || null;
            } catch {
              waterPollution = null;
            }
          }
        }
        
        // Build alerts
        const alerts = [];
        if (latestReport && latestReport.risk_level?.toUpperCase().includes("HIGH")) {
          alerts.push("⚠️ Your latest health assessment shows HIGH risk. Please consult a healthcare professional.");
        }
        if (!user?.state) {
          alerts.push("ℹ️ Please update your biodata with your state to receive pollution alerts.");
        }
        if (waterPollution && (waterPollution.edibility === "NON EDIBLE" || waterPollution.status === "UNSAFE")) {
          alerts.push(`🚨 Water in ${user?.state} is unsafe for drinking.`);
        } else if (waterPollution && waterPollution.edibility === "MODERATE") {
          alerts.push(`⚠️ Water in ${waterPollution.state} is moderate quality. Boil before drinking.`);
        }
        
        setSummary({
          latestRiskStatus: latestReport?.risk_level || "No reports yet",
          waterPollutionStatus: waterPollution ? {
            state: waterPollution.state,
            pollution_level: waterPollution.pollution_level,
            edibility: waterPollution.edibility,
            statusLabel: getPollutionStatusLabel(waterPollution)
          } : null,
          alerts: alerts,
          history: reports
        });
        setError("");
      } catch (requestError) {
        console.error(requestError);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) {
    return <div className="page-center">Loading dashboard...</div>;
  }

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <h2>Welcome, {user?.name || "User"}</h2>
          <p>Track your health risk and water pollution alerts in one place.</p>
        </div>
        <Link className="btn primary" to="/app/health-check">
          Quick Health Check
        </Link>
      </section>

      {error && <div className="card error">{error}</div>}

      <section className="card summary-grid">
        <div>
          <div className="result-label">Latest Health Risk</div>
          <div className="result-value">{summary?.latestRiskStatus || "No reports yet"}</div>
        </div>
        <div>
          <div className="result-label">State Pollution Status</div>
          <div className="result-value">
            {summary?.waterPollutionStatus
              ? `${summary.waterPollutionStatus.state} - ${summary.waterPollutionStatus.statusLabel}`
              : user?.state
                ? "No pollution data"
                : "Add state in Biodata"}
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Alerts</h3>
        {!summary?.alerts?.length ? (
          <p className="muted">No active alerts.</p>
        ) : (
          <div className="report-list">
            {summary.alerts.map((alert) => (
              <div className="alert danger" key={alert}>
                {alert}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h3>Health Report History</h3>
        {!summary?.history?.length ? (
          <p className="muted">No reports yet.</p>
        ) : (
          <div className="history-grid">
            <div className="report-list">
              {summary.history.map((report) => (
                <Link className="report-item" key={report._id} to={`/app/result/${report._id}`}>
                  <div>
                    <div className="report-title">{report.risk_level}</div>
                    <div className="report-date">{new Date(report.date).toLocaleString()}</div>
                  </div>
                  <span className={`pill ${report.risk_level.toLowerCase().includes("high") ? "high" : report.risk_level.toLowerCase().includes("medium") ? "medium" : "low"}`}>
                    {report.risk_level}
                  </span>
                </Link>
              ))}
            </div>

            <div className="chart-card">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={summary.history
                    .slice()
                    .reverse()
                    .map((item) => ({
                      date: new Date(item.date).toLocaleDateString(),
                      score: item.risk_level.includes("HIGH")
                        ? 3
                        : item.risk_level.includes("MEDIUM")
                          ? 2
                          : 1
                    }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 3]} ticks={[1, 2, 3]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#2a7bd1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
