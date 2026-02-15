import React, { useEffect, useState } from "react";
import api from "../api/client";

const emptyForm = { name: "", symptoms: "", severity: "medium", advice: "" };

const AdminPanel = () => {
  const [diseases, setDiseases] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadDiseases = async () => {
    try {
      const response = await api.get("/api/admin/diseases");
      setDiseases(response.data.diseases || []);
    } catch (err) {
      setError("Unable to load disease dataset.");
    }
  };

  useEffect(() => {
    loadDiseases();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const saveDisease = async (event) => {
    event.preventDefault();
    setError("");
    const payload = {
      name: form.name.trim(),
      symptoms: form.symptoms.split(",").map((item) => item.trim()).filter(Boolean),
      severity: form.severity,
      advice: form.advice.trim()
    };

    try {
      if (editingId) {
        await api.put(`/api/admin/diseases/${editingId}`, payload);
      } else {
        await api.post("/api/admin/diseases", payload);
      }
      resetForm();
      loadDiseases();
    } catch (err) {
      setError("Unable to save disease. Check inputs.");
    }
  };

  const editDisease = (disease) => {
    setEditingId(disease._id);
    setForm({
      name: disease.name,
      symptoms: disease.symptoms.join(", "),
      severity: disease.severity,
      advice: disease.advice
    });
  };

  const removeDisease = async (id) => {
    try {
      await api.delete(`/api/admin/diseases/${id}`);
      loadDiseases();
    } catch (err) {
      setError("Unable to delete disease.");
    }
  };

  return (
    <div className="page-stack">
      <section className="card">
        <h2>Admin Disease Dataset</h2>
        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={saveDisease}>
          <div className="form-grid">
            <label>
              Disease name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Symptoms (comma separated)
              <input name="symptoms" value={form.symptoms} onChange={handleChange} required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Severity
              <select name="severity" value={form.severity} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              Advice
              <input name="advice" value={form.advice} onChange={handleChange} required />
            </label>
          </div>
          <div className="row">
            <button className="btn primary" type="submit">
              {editingId ? "Update Disease" : "Add Disease"}
            </button>
            {editingId && (
              <button className="btn ghost" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h3>Current Diseases</h3>
        <div className="report-list">
          {diseases.map((disease) => (
            <div className="report-item" key={disease._id}>
              <div>
                <div className="report-title">{disease.name}</div>
                <div className="report-date">{disease.symptoms.join(", ")}</div>
              </div>
              <div className="row">
                <button className="btn ghost" type="button" onClick={() => editDisease(disease)}>
                  Edit
                </button>
                <button className="btn danger" type="button" onClick={() => removeDisease(disease._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
