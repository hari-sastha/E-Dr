import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const symptomOptions = [
  "Diarrhea",
  "Vomiting",
  "Fever",
  "Stomach pain",
  "Nausea",
  "Dehydration",
  "Jaundice",
  "Fatigue",
  "Skin rashes",
  "Headache",
  "Blood in stool"
];

const HealthCheck = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [source, setSource] = useState("River");
  const [boil, setBoil] = useState(false);
  const [filter, setFilter] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleSymptom = (value) => {
    setSymptoms((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        personalInfo: { age: Number(age), gender },
        waterInfo: { source, boil, filter },
        symptoms: symptoms.map((item) => item.toLowerCase())
      };

      const response = await api.post("/api/health/assess", payload);
      navigate(`/app/result/${response.data.reportId}`, { state: response.data.result });
    } catch (err) {
      setError("Unable to process health check.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Health Check Form</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-section">
          <h4>Personal Info</h4>
          <div className="form-grid">
            <label>
              Age
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                required
              />
            </label>
            <label>
              Gender
              <select value={gender} onChange={(event) => setGender(event.target.value)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h4>Water Information</h4>
          <div className="form-grid">
            <label>
              Main source of water
              <select value={source} onChange={(event) => setSource(event.target.value)}>
                <option>River</option>
                <option>Well</option>
                <option>Borewell</option>
                <option>Tap</option>
                <option>Tanker</option>
                <option>Pond</option>
              </select>
            </label>
            <label className="switch">
              <input type="checkbox" checked={boil} onChange={() => setBoil((prev) => !prev)} />
              <span>Do you boil water?</span>
            </label>
            <label className="switch">
              <input type="checkbox" checked={filter} onChange={() => setFilter((prev) => !prev)} />
              <span>Do you filter water?</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h4>Symptoms</h4>
          <div className="checkbox-grid">
            {symptomOptions.map((symptom) => (
              <label key={symptom} className="checkbox">
                <input
                  type="checkbox"
                  checked={symptoms.includes(symptom)}
                  onChange={() => toggleSymptom(symptom)}
                />
                <span>{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit Health Check"}
        </button>
      </form>
    </div>
  );
};

export default HealthCheck;
