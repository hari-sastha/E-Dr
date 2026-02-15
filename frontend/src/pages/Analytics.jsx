import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import api from "../api/client";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const [trends, setTrends] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const response = await api.get("/api/analytics/trends");
        setTrends(response.data.trends || []);
      } catch (err) {
        setError("Unable to load analytics.");
      }
    };

    loadTrends();
  }, []);

  const data = {
    labels: trends.map((item) => item._id),
    datasets: [
      {
        label: "Reports",
        data: trends.map((item) => item.count),
        backgroundColor: "rgba(34, 122, 210, 0.65)"
      }
    ]
  };

  return (
    <div className="page-stack">
      <section className="card">
        <h2>Disease Trends</h2>
        {error && <div className="error">{error}</div>}
        {trends.length === 0 ? (
          <p className="muted">No data available yet.</p>
        ) : (
          <Bar data={data} />
        )}
      </section>
    </div>
  );
};

export default Analytics;
