import React, { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useLocation, useParams } from "react-router-dom";
import api from "../api/client";
import NearestHospitalCard from "../components/NearestHospitalCard";

const COLORS = ["#2a9d5f", "#f2a93b", "#d63535"];
const CATEGORY_COLORS = {
  "Gastrointestinal": "#8b5cf6",
  "Systemic": "#ec4899",
  "Hydration": "#06b6d4",
  "Respiratory": "#f59e0b",
  "Other": "#6366f1"
};

const riskToClass = (value) => {
  if (value?.includes("HIGH")) {
    return "high";
  }

  if (value?.includes("MEDIUM")) {
    return "medium";
  }

  return "low";
};

const Result = () => {
  const location = useLocation();
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const response = await api.get(`/api/reports/${id}`);
        setReport(response.data.report);
      } catch (requestError) {
        setError("Unable to load report.");
      }
    };

    loadReport();
  }, [id]);

  const riskLevel = report?.risk_level || location.state?.riskLevel || "LOW RISK";
  const severityClass = riskToClass(riskLevel);
  const hospitals = report?.nearest_hospitals || location.state?.nearestHospitals || [];

  // Categorize symptoms
  const symptomCategories = {
    "Gastrointestinal": ["Diarrhea", "Vomiting", "Nausea", "Stomach Pain", "Abdominal Cramps", "Loss of Appetite", "stomach pain"],
    "Systemic": ["Fever", "Chills", "Fatigue", "Weakness", "Headache", "Body Aches", "fever", "fatigue"],
    "Hydration": ["Dehydration", "Dry Mouth", "Dark Urine", "Dizziness", "Excessive Thirst", "dehydration"],
    "Respiratory": ["Cough", "Sore Throat", "Shortness of Breath", "Runny Nose"]
  };

  const categorizeSymptoms = () => {
    const categorized = { "Gastrointestinal": 0, "Systemic": 0, "Hydration": 0, "Respiratory": 0, "Other": 0 };
    (report?.symptoms || []).forEach((symptom) => {
      let found = false;
      for (const [category, symptoms] of Object.entries(symptomCategories)) {
        if (symptoms.some(s => s.toLowerCase() === symptom.toLowerCase())) {
          categorized[category]++;
          found = true;
          break;
        }
      }
      if (!found) categorized["Other"]++;
    });
    return categorized;
  };

  const chartData = useMemo(() => {
    const categorized = categorizeSymptoms();
    return Object.entries(categorized)
      .filter(([, count]) => count > 0)
      .map(([category, count]) => ({
        name: category,
        count,
        fill: CATEGORY_COLORS[category]
      }));
  }, [report]);

  if (error) {
    return <div className="card error">{error}</div>;
  }

  if (!report && !location.state) {
    return <div className="page-center">Loading...</div>;
  }

  return (
    <div className="page-stack">
      <section className={`card result-card ${severityClass}`}>
        <h2>Health Risk Result</h2>
        <div className="result-grid">
          <div>
            <div className="result-label">Risk Level</div>
            <div className={`pill ${severityClass}`}>{riskLevel}</div>
          </div>
          <div>
            <div className="result-label">Detected Symptoms</div>
            <div className="result-value">{report?.symptoms?.length || 0}</div>
          </div>
          <div>
            <div className="result-label">Date</div>
            <div>{report?.date ? new Date(report.date).toLocaleString() : "Now"}</div>
          </div>
        </div>
      </section>

      <section className="card chart-card">
        <h3>Symptom Analysis & Health Insights</h3>

        {/* Symptoms by Category Chart */}
        <div style={{ marginBottom: "2rem" }}>
          <h4 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
            Symptoms Distribution by Category
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px"
                }}
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Symptoms List */}
        <div style={{ marginBottom: "2rem" }}>
          <h4 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
            Detected Symptoms
          </h4>
          {(report?.symptoms || []).length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "0.75rem"
              }}
            >
              {(report?.symptoms || []).map((symptom, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    background: "#f9fafb",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb"
                  }}
                >
                  <span style={{ fontSize: "1.125rem" }}>✓</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                    {symptom}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#666" }}>No symptoms recorded.</p>
          )}
        </div>

        {/* Health Insights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem"
          }}
        >
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              padding: "1rem"
            }}
          >
            <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#0c4a6e", marginBottom: "0.5rem" }}>
              Total Symptoms
            </div>
            <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "#2563eb" }}>
              {report?.symptoms?.length || 0}
            </div>
          </div>

          <div
            style={{
              background: riskLevel === "HIGH RISK" ? "#fee2e2" : riskLevel === "MEDIUM RISK" ? "#fef3c7" : "#f0fdf4",
              border: `1px solid ${riskLevel === "HIGH RISK" ? "#fecaca" : riskLevel === "MEDIUM RISK" ? "#fcd34d" : "#bbf7d0"}`,
              borderRadius: "8px",
              padding: "1rem",
              borderLeft: `4px solid ${riskLevel === "HIGH RISK" ? "#ef4444" : riskLevel === "MEDIUM RISK" ? "#f59e0b" : "#22c55e"}`
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: riskLevel === "HIGH RISK" ? "#7f1d1d" : riskLevel === "MEDIUM RISK" ? "#78350f" : "#14532d",
                marginBottom: "0.5rem"
              }}
            >
              Health Risk Level
            </div>
            <div
              style={{
                fontSize: "1.875rem",
                fontWeight: "700",
                color: riskLevel === "HIGH RISK" ? "#dc2626" : riskLevel === "MEDIUM RISK" ? "#d97706" : "#16a34a"
              }}
            >
              {riskLevel}
            </div>
          </div>

          <div
            style={{
              background: "#f3e8ff",
              border: "1px solid #e9d5ff",
              borderRadius: "8px",
              padding: "1rem"
            }}
          >
            <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#6b21a8", marginBottom: "0.5rem" }}>
              Assessment Date
            </div>
            <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#a855f7" }}>
              {report?.date ? new Date(report.date).toLocaleDateString() : "Today"}
            </div>
          </div>
        </div>

        {/* Health Recommendations */}
        <div
          style={{
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            borderRadius: "8px",
            padding: "1rem"
          }}
        >
          <h4 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#3730a3", marginBottom: "0.75rem" }}>
            💡 Health Recommendations
          </h4>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#1e1b4b", fontSize: "0.875rem", lineHeight: "1.6" }}>
            {riskLevel === "HIGH RISK" && (
              <>
                <li>✓ Seek immediate medical attention from a qualified healthcare professional</li>
                <li>✓ Stay hydrated with clean water (avoid contaminated water sources)</li>
                <li>✓ Isolate yourself if transmissible symptoms are present</li>
                <li>✓ Maintain proper hygiene and sanitation</li>
              </>
            )}
            {riskLevel === "MEDIUM RISK" && (
              <>
                <li>✓ Schedule an appointment with a healthcare provider</li>
                <li>✓ Monitor your symptoms closely for any changes</li>
                <li>✓ Maintain good hydration and rest</li>
                <li>✓ Avoid contaminated water and ensure food safety</li>
              </>
            )}
            {riskLevel === "LOW RISK" && (
              <>
                <li>✓ Continue regular health monitoring</li>
                <li>✓ Maintain good hygiene practices</li>
                <li>✓ Drink clean water and maintain balanced nutrition</li>
                <li>✓ Consult a doctor if symptoms worsen</li>
              </>
            )}
          </ul>
        </div>
      </section>

      <section className="card">
        <h3>Nearest Hospitals</h3>
        {!hospitals.length ? (
          <p className="muted">No hospitals found. Try allowing location access before check.</p>
        ) : (
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <NearestHospitalCard
                key={`${hospital.name}-${hospital.lat}`}
                hospital={hospital}
                riskLevel={riskLevel}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Result;
