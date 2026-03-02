import React, { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import api from "../api/client";

const WaterSafety = () => {
  const [waterData, setWaterData] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateDetails, setStateDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAlertColor = (edibility) => {
    if (edibility === "EDIBLE") return { bg: "#dcfce7", border: "#86efac", text: "#166534" };
    if (edibility === "MODERATE") return { bg: "#fef3c7", border: "#fcd34d", text: "#78350f" };
    return { bg: "#fee2e2", border: "#fca5a5", text: "#7f1d1d" };
  };

  const getQualityColor = (index) => {
    if (index >= 70) return "#22c55e"; // Green
    if (index >= 50) return "#f59e0b"; // Amber
    if (index >= 30) return "#ef4444"; // Red
    return "#7f1d1d"; // Dark Red
  };

  useEffect(() => {
    const loadWaterData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/water-pollution");
        const data = response.data.data || [];
        setWaterData(data);
        // Set first state as default
        if (data.length > 0) {
          loadStateDetails(data[0].state);
        }
        setError("");
      } catch (err) {
        setError("Failed to load water safety data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWaterData();
  }, []);

  const loadStateDetails = async (state) => {
    try {
      const response = await api.get(`/api/water-pollution/state/${state}`);
      setStateDetails(response.data.data);
      setSelectedState(state);
    } catch (err) {
      console.error(err);
      setStateDetails(null);
    }
  };

  const chartData = useMemo(() => {
    return waterData.map(item => ({
      name: item.state,
      wqi: item.water_quality_index || 0,
      edibility: item.edibility,
      fill: getQualityColor(item.water_quality_index || 0)
    }));
  }, [waterData]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <p>Loading water safety data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 0.5rem 0" }}>
          💧 Water Safety Dashboard
        </h1>
        <p style={{ color: "#666", margin: 0 }}>
          Monitor water quality and edibility across Indian states
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#7f1d1d",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem"
          }}
        >
          {error}
        </div>
      )}

      {/* Main Chart */}
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
          Water Quality Index by State
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
            <YAxis label={{ value: "Water Quality Index (0-100)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px"
              }}
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div style={{ padding: "8px", fontSize: "12px" }}>
                      <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>{data.name}</p>
                      <p style={{ margin: "0", color: "#666" }}>WQI: {data.wqi}</p>
                      <p style={{ margin: "0", color: "#666" }}>Status: {data.edibility}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="wqi" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* State Selector Dropdown */}
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}
      >
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "1rem", fontWeight: "600", color: "var(--text-primary)" }}>
          Select State to View Details
        </label>
        <select
          value={selectedState || ""}
          onChange={(e) => loadStateDetails(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            backgroundColor: "white",
            color: "var(--text-primary)",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            transition: "border-color 0.3s ease"
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        >
          {waterData.map((state) => (
            <option key={state._id} value={state.state}>
              {state.state} (WQI: {state.water_quality_index})
            </option>
          ))}
        </select>
      </div>

      {/* Detailed State View */}
      {stateDetails && (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "2rem",
            marginTop: "0rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "2rem" }}>
            📊 {selectedState} - Detailed Water Quality Analysis
          </h2>

          {/* Key Metrics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem"
            }}
          >
            {/* WQI Card */}
            <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", padding: "1.5rem", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
              <div style={{ fontSize: "0.875rem", color: "#0c4a6e", marginBottom: "0.75rem", fontWeight: "600" }}>Water Quality Index</div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#2563eb" }}>
                {stateDetails.water_quality_index}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#0c4a6e", marginTop: "0.5rem" }}>Scale: 0-100</div>
            </div>

            {/* pH Card */}
            <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "1.5rem", borderRadius: "12px", border: "1px solid #fcd34d" }}>
              <div style={{ fontSize: "0.875rem", color: "#78350f", marginBottom: "0.75rem", fontWeight: "600" }}>pH Level</div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#d97706" }}>
                {stateDetails.ph_level?.toFixed(1)}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#78350f", marginTop: "0.5rem" }}>Optimal: 6.5-8.5</div>
            </div>

            {/* Edibility Status Card */}
            <div style={{ background: "linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e9d5ff" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b21a8", marginBottom: "0.75rem", fontWeight: "600" }}>Edibility Status</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#a855f7" }}>
                {stateDetails.edibility}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b21a8", marginTop: "0.5rem" }}>
                {stateDetails.status}
              </div>
            </div>
          </div>

          {/* Detailed Alert Box */}
          <div
            style={{
              background: getAlertColor(stateDetails.edibility).bg,
              border: `2px solid ${getAlertColor(stateDetails.edibility).border}`,
              borderLeft: `6px solid ${getAlertColor(stateDetails.edibility).border}`,
              color: getAlertColor(stateDetails.edibility).text,
              borderRadius: "8px",
              padding: "1.25rem",
              marginBottom: "2rem",
              fontSize: "1rem",
              fontWeight: "600"
            }}
          >
            ⚠️ {stateDetails.alert_message}
          </div>

          {/* Contamination Level */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
              Contamination Status
            </h3>
            <div
              style={{
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: stateDetails.contamination_level === "High" ? "#fee2e2" : stateDetails.contamination_level === "Moderate" ? "#fef3c7" : "#dcfce7",
                color: stateDetails.contamination_level === "High" ? "#7f1d1d" : stateDetails.contamination_level === "Moderate" ? "#78350f" : "#166534",
                border: `1px solid ${stateDetails.contamination_level === "High" ? "#fca5a5" : stateDetails.contamination_level === "Moderate" ? "#fcd34d" : "#86efac"}`,
                fontSize: "1rem",
                fontWeight: "600"
              }}
            >
              {stateDetails.contamination_level} Contamination Level
            </div>
          </div>

          {/* Additional Metrics */}
          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
              Advanced Water Quality Metrics
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              {stateDetails.dissolved_oxygen !== undefined && (
                <div style={{ background: "#f0fdf4", padding: "1rem", borderRadius: "8px", border: "1px solid #86efac" }}>
                  <div style={{ fontSize: "0.875rem", color: "#166534", marginBottom: "0.5rem", fontWeight: "600" }}>Dissolved Oxygen</div>
                  <div style={{ fontSize: "1.375rem", fontWeight: "700", color: "#22c55e" }}>{stateDetails.dissolved_oxygen}</div>
                  <div style={{ fontSize: "0.75rem", color: "#166534" }}>mg/L</div>
                </div>
              )}
              {stateDetails.turbidity !== undefined && (
                <div style={{ background: "#fef2f2", padding: "1rem", borderRadius: "8px", border: "1px solid #fca5a5" }}>
                  <div style={{ fontSize: "0.875rem", color: "#7f1d1d", marginBottom: "0.5rem", fontWeight: "600" }}>Turbidity</div>
                  <div style={{ fontSize: "1.375rem", fontWeight: "700", color: "#ef4444" }}>{stateDetails.turbidity}</div>
                  <div style={{ fontSize: "0.75rem", color: "#7f1d1d" }}>NTU</div>
                </div>
              )}
              {stateDetails.total_hardness !== undefined && (
                <div style={{ background: "#f0f9ff", padding: "1rem", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                  <div style={{ fontSize: "0.875rem", color: "#0c4a6e", marginBottom: "0.5rem", fontWeight: "600" }}>Total Hardness</div>
                  <div style={{ fontSize: "1.375rem", fontWeight: "700", color: "#2563eb" }}>{stateDetails.total_hardness}</div>
                  <div style={{ fontSize: "0.75rem", color: "#0c4a6e" }}>mg/L</div>
                </div>
              )}
              {stateDetails.chlorine_residual !== undefined && (
                <div style={{ background: "#fef3c7", padding: "1rem", borderRadius: "8px", border: "1px solid #fcd34d" }}>
                  <div style={{ fontSize: "0.875rem", color: "#78350f", marginBottom: "0.5rem", fontWeight: "600" }}>Chlorine Residual</div>
                  <div style={{ fontSize: "1.375rem", fontWeight: "700", color: "#d97706" }}>{stateDetails.chlorine_residual}</div>
                  <div style={{ fontSize: "0.75rem", color: "#78350f" }}>mg/L</div>
                </div>
              )}
            </div>
          </div>

          {/* Source and Testing Agency */}
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              {stateDetails.source && (
                <div>
                  <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.25rem", fontWeight: "600" }}>Water Source</div>
                  <div style={{ fontSize: "1rem", color: "var(--text-primary)" }}>{stateDetails.source}</div>
                </div>
              )}
              {stateDetails.testing_agency && (
                <div>
                  <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.25rem", fontWeight: "600" }}>Testing Agency</div>
                  <div style={{ fontSize: "1rem", color: "var(--text-primary)" }}>{stateDetails.testing_agency}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.25rem", fontWeight: "600" }}>Last Updated</div>
                <div style={{ fontSize: "1rem", color: "var(--text-primary)" }}>
                  {new Date(stateDetails.date).toLocaleDateString()} {new Date(stateDetails.date).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {stateDetails.notes && (
            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px", borderLeft: "4px solid #2563eb" }}>
              <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>Notes</div>
              <div style={{ fontSize: "1rem", color: "var(--text-primary)" }}>{stateDetails.notes}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WaterSafety;
