import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../api/client";

const Result = () => {
  const location = useLocation();
  const { id } = useParams();
  const [result, setResult] = useState(location.state || null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      if (result) {
        return;
      }

      try {
        const response = await api.get(`/api/reports/${id}`);
        setReport(response.data.report);
        setResult(response.data.report.result);
      } catch (err) {
        setError("Unable to load report.");
      }
    };

    loadReport();
  }, [id, result]);

  if (error) {
    return <div className="card error">{error}</div>;
  }

  if (!result) {
    return <div className="page-center">Loading...</div>;
  }

  const severity = result.severity || "low";

  return (
    <div className="page-stack">
      <section className={`card result-card ${severity}`}>
        <h2>Health Alert Result</h2>
        <div className="result-grid">
          <div>
            <div className="result-label">Possible disease</div>
            <div className="result-value">{result.diseaseName}</div>
          </div>
          <div>
            <div className="result-label">Risk level</div>
            <div className={`pill ${severity}`}>{severity}</div>
          </div>
          <div>
            <div className="result-label">Advice</div>
            <div className="result-advice">{result.advice}</div>
          </div>
        </div>
        {severity === "high" && (
          <div className="alert danger">Emergency warning: seek immediate care.</div>
        )}
      </section>

      <section className="card">
        <h3>Nearest Hospital</h3>
        <p className="muted">Placeholder: integrate local facility directory here.</p>
      </section>

      {report && (
        <section className="card">
          <h3>Report Details</h3>
          <div className="report-details">
            <div>
              <span>Age:</span> {report.personalInfo?.age}
            </div>
            <div>
              <span>Gender:</span> {report.personalInfo?.gender}
            </div>
            <div>
              <span>Water source:</span> {report.waterInfo?.source}
            </div>
            <div>
              <span>Boil:</span> {report.waterInfo?.boil ? "Yes" : "No"}
            </div>
            <div>
              <span>Filter:</span> {report.waterInfo?.filter ? "Yes" : "No"}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Result;
