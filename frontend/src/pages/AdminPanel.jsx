import React, { useEffect, useState } from "react";
import api from "../api/client";

const AdminPanel = () => {
  const [pollutionForm, setPollutionForm] = useState({
    state: "",
    water_quality_index: 50,
    ph_level: 7,
    contamination_level: "Moderate",
    date: "",
    dissolved_oxygen: "",
    turbidity: "",
    total_hardness: "",
    chlorine_residual: "",
    notes: ""
  });
  const [contactForm, setContactForm] = useState({ state: "", official_email: "" });
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [usersResponse, reportsResponse] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/admin/reports")
      ]);
      setUsers(usersResponse.data.users || []);
      setReports(reportsResponse.data.reports || []);
    } catch (requestError) {
      setError("Unable to load admin data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const savePollution = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/api/water-pollution/add", pollutionForm);
      setSuccess("Water pollution data added successfully!");
      setPollutionForm({
        state: "",
        water_quality_index: 50,
        ph_level: 7,
        contamination_level: "Moderate",
        date: "",
        dissolved_oxygen: "",
        turbidity: "",
        total_hardness: "",
        chlorine_residual: "",
        notes: ""
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (requestError) {
      setError("Failed to save water pollution data.");
    }
  };

  const saveContact = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/api/admin/government-contacts", contactForm);
      setSuccess("Government contact added successfully!");
      setContactForm({ state: "", official_email: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (requestError) {
      setError("Failed to save government contact.");
    }
  };

  return (
    <div className="page-stack">
      {error && <div className="card error">{error}</div>}

      <section className="card">
        <h2>Water Pollution Entry</h2>
        <form className="form" onSubmit={savePollution}>
          <div className="form-grid">
            <label>
              State
              <input
                value={pollutionForm.state}
                onChange={(event) =>
                  setPollutionForm((prev) => ({ ...prev, state: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Pollution Level
              <select
                value={pollutionForm.pollution_level}
                onChange={(event) =>
                  setPollutionForm((prev) => ({ ...prev, pollution_level: event.target.value }))
                }
              >
                <option>Safe</option>
                <option>Moderate</option>
                <option>High</option>
                <option>Danger</option>
              </select>
            </label>
            <label>
              Date
              <input
                type="datetime-local"
                value={pollutionForm.date}
                onChange={(event) =>
                  setPollutionForm((prev) => ({ ...prev, date: event.target.value }))
                }
              />
            </label>
          </div>
          <button className="btn primary" type="submit">
            Add Pollution Data
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Government Contacts</h2>
        <form className="form" onSubmit={saveContact}>
          <div className="form-grid">
            <label>
              State
              <input
                value={contactForm.state}
                onChange={(event) =>
                  setContactForm((prev) => ({ ...prev, state: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Official Email
              <input
                type="email"
                value={contactForm.official_email}
                onChange={(event) =>
                  setContactForm((prev) => ({ ...prev, official_email: event.target.value }))
                }
                required
              />
            </label>
          </div>
          <button className="btn primary" type="submit">
            Add Government Email
          </button>
        </form>
      </section>

      <section className="card">
        <h3>Registered Users</h3>
        <div className="report-list">
          {users.map((user) => (
            <div className="report-item" key={user._id}>
              <div>
                <div className="report-title">{user.name || "Unnamed"}</div>
                <div className="report-date">{user.email || "No email"}</div>
              </div>
              <div className="report-date">{user.state || "No state"}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>All Health Reports</h3>
        <div className="report-list">
          {reports.map((report) => (
            <div className="report-item" key={report._id}>
              <div>
                <div className="report-title">{report.user_id?.name || "Unknown User"}</div>
                <div className="report-date">{new Date(report.date).toLocaleString()}</div>
              </div>
              <span className={`pill ${report.risk_level.includes("HIGH") ? "high" : report.risk_level.includes("MEDIUM") ? "medium" : "low"}`}>
                {report.risk_level}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
