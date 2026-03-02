import React, { useEffect, useMemo, useState } from "react";
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

const levelScore = {
  Safe: 1,
  Moderate: 2,
  High: 3,
  Danger: 4
};

const Analytics = () => {
  const [pollution, setPollution] = useState([]);
  const [riskTrends, setRiskTrends] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [pollutionResponse, trendsResponse] = await Promise.all([
          api.get("/api/analytics/pollution-overview"),
          api.get("/api/analytics/risk-trends")
        ]);

        setPollution(pollutionResponse.data.states || []);
        setRiskTrends(trendsResponse.data.trends || []);
      } catch (requestError) {
        setError("Unable to load analytics.");
      }
    };

    loadAnalytics();
  }, []);

  const pollutionChart = useMemo(
    () =>
      pollution.map((item) => ({
        state: item._id,
        level: levelScore[item.pollution_level] || 0,
        label: item.pollution_level
      })),
    [pollution]
  );

  return (
    <div className="page-stack">
      <section className="card">
        <h2>Water Pollution Monitoring (All States)</h2>
        {error && <div className="error">{error}</div>}
        {!pollutionChart.length ? (
          <p className="muted">No state pollution data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={pollutionChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" interval={0} angle={-30} textAnchor="end" height={80} />
              <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} />
              <Tooltip formatter={(value, name, item) => [item.payload.label, "Pollution Level"]} />
              <Bar dataKey="level" fill="#2a7bd1" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="card">
        <h2>Health Risk Trends</h2>
        {!riskTrends.length ? (
          <p className="muted">No report trend data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskTrends.map((item) => ({ risk: item._id, count: item.count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="risk" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1f4f85" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
};

export default Analytics;
