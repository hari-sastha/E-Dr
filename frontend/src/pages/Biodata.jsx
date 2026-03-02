import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const Biodata = () => {
  const { user, completeProfile, needsProfileCompletion } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "Male",
    bloodGroup: user?.bloodGroup || "",
    phone: user?.phone || "",
    state: user?.state || "",
    district: user?.district || ""
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      age: user?.age || "",
      gender: user?.gender || "Male",
      bloodGroup: user?.bloodGroup || "",
      phone: user?.phone || "",
      state: user?.state || "",
      district: user?.district || ""
    });
  }, [user]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await completeProfile({ ...form, age: Number(form.age) });
      navigate("/app/dashboard");
    } catch (submissionError) {
      setError("Unable to save biodata. Please verify all fields.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card form" onSubmit={onSubmit}>
        <div className="badge">Biodata</div>
        <h2>{needsProfileCompletion ? "Complete Your Profile" : "Edit Your Profile"}</h2>
        <p>
          {needsProfileCompletion
            ? "Please provide your biodata before accessing EDR services."
            : "Update your biodata. Your state is used for pollution monitoring and alerts."}
        </p>
        {error && <div className="error">{error}</div>}

        <div className="form-grid">
          <label>
            Full Name
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
          <label>
            Age
            <input
              type="number"
              min="1"
              max="120"
              name="age"
              value={form.age}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Gender
            <select name="gender" value={form.gender} onChange={onChange}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Blood Group
            <input name="bloodGroup" value={form.bloodGroup} onChange={onChange} required />
          </label>
          <label>
            Phone Number
            <input name="phone" value={form.phone} onChange={onChange} required />
          </label>
          <label>
            State
            <input name="state" value={form.state} onChange={onChange} required />
          </label>
          <label>
            District
            <input name="district" value={form.district} onChange={onChange} required />
          </label>
        </div>

        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : needsProfileCompletion ? "Save Biodata" : "Update Biodata"}
        </button>
      </form>
    </div>
  );
};

export default Biodata;
