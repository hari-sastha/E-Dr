import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const symptomCategories = {
  "Gastrointestinal": [
    "Diarrhea",
    "Vomiting",
    "Nausea",
    "Stomach Pain",
    "Abdominal Cramps",
    "Loss of Appetite"
  ],
  "Systemic": [
    "Fever",
    "Chills",
    "Fatigue",
    "Weakness",
    "Headache",
    "Body Aches"
  ],
  "Hydration": [
    "Dehydration",
    "Dry Mouth",
    "Dark Urine",
    "Dizziness",
    "Excessive Thirst"
  ],
  "Respiratory": [
    "Cough",
    "Sore Throat",
    "Shortness of Breath",
    "Runny Nose"
  ]
};

const HealthCheck = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleSymptom = (value) => {
    setSymptoms((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms([...symptoms, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const removeCustomSymptom = (symptom) => {
    setSymptoms((prev) => prev.filter((item) => item !== symptom));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoadingLocation(false);
      },
      () => {
        setError("Unable to fetch your location.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        symptoms,
        ...(location.latitude && location.longitude ? location : {})
      };

      const response = await api.post("/api/health/assess", payload);
      navigate(`/app/result/${response.data.reportId}`, {
        state: {
          riskLevel: response.data.riskLevel,
          nearestHospitals: response.data.nearestHospitals
        }
      });
    } catch (requestError) {
      setError("Unable to process health check.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <form className="card form" onSubmit={onSubmit}>
        <h2>Online Health Check</h2>
        <p className="muted">Select symptoms and optionally share location for nearest hospitals.</p>
        {error && <div className="error">{error}</div>}

        <div className="form-section">
          <h4>Symptoms ({symptoms.length} selected)</h4>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary, #666)", marginBottom: "1rem" }}>
            Select symptoms or add your own.
          </p>

          {/* Categorized Symptoms */}
          <div style={{ marginBottom: "1.5rem" }}>
            {Object.entries(symptomCategories).map(([category, categorySymptoms]) => (
              <div
                key={category}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "#f9f9f9",
                  padding: "1rem",
                  marginBottom: "1rem",
                  cursor: "pointer"
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCategory(expandedCategory === category ? null : category)
                  }
                  style={{
                    width: "100%",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.5rem",
                    fontSize: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>{category}</span>
                  <span style={{ color: "#999" }}>
                    {expandedCategory === category ? "▼" : "▶"}
                  </span>
                </button>

                {expandedCategory === category && (
                  <div
                    style={{
                      marginTop: "1rem",
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "0.75rem"
                    }}
                  >
                    {categorySymptoms.map((symptom) => (
                      <label
                        key={symptom}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem",
                          cursor: "pointer",
                          borderRadius: "4px",
                          transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <input
                          type="checkbox"
                          checked={symptoms.includes(symptom)}
                          onChange={() => toggleSymptom(symptom)}
                          style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                        />
                        <span style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>
                          {symptom}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Custom Symptom Input */}
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem"
            }}
          >
            <h5 style={{ fontWeight: "600", color: "#0c4a6e", marginBottom: "0.75rem" }}>
              Add Custom Symptom
            </h5>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomSymptom()}
                placeholder="Enter your symptom (e.g., 'Joint Pain')"
                style={{
                  flex: 1,
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #93c5fd",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontFamily: "inherit",
                  color: "var(--text-primary)"
                }}
              />
              <button
                type="button"
                onClick={addCustomSymptom}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected Symptoms Display */}
          {symptoms.length > 0 && (
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "#f3f4f6",
                borderRadius: "8px"
              }}
            >
              <h5 style={{ fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                Selected Symptoms
              </h5>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    style={{
                      padding: "0.25rem 0.75rem",
                      background: "#2563eb",
                      color: "white",
                      fontSize: "0.875rem",
                      borderRadius: "20px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    {symptom}
                    <button
                      type="button"
                      onClick={() => removeCustomSymptom(symptom)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "1rem",
                        padding: "0"
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="row">
          <button className="btn secondary" type="button" onClick={getLocation}>
            {loadingLocation ? "Fetching location..." : "Use My Location"}
          </button>
          {location.latitude && location.longitude && (
            <span className="muted">Location captured</span>
          )}
        </div>

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit Health Check"}
        </button>
      </form>
    </div>
  );
};

export default HealthCheck;
