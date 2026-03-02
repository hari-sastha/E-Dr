import React from "react";

const NearestHospitalCard = ({ hospital, riskLevel }) => {
  // Determine alert message and colors based on distance
  const getAlertConfig = (distance) => {
    if (distance < 1) {
      return {
        message: "🟢 Emergency support is very close to your location. You can reach immediately.",
        bgColor: "#dcfce7",
        borderColor: "#86efac",
        textColor: "#166534"
      };
    } else if (distance >= 1 && distance <= 5) {
      return {
        message: "🟡 Nearest hospital is within reachable distance. Please proceed safely.",
        bgColor: "#fef3c7",
        borderColor: "#fcd34d",
        textColor: "#78350f"
      };
    } else {
      return {
        message: "🔴 Warning: Nearest hospital is far from your location. Consider emergency transport.",
        bgColor: "#fee2e2",
        borderColor: "#fca5a5",
        textColor: "#7f1d1d"
      };
    }
  };

  const alertConfig = getAlertConfig(hospital.distance_km);

  return (
    <div
      style={{
        border: "2px solid #e5e7eb",
        background: "white",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        transition: "box-shadow 0.3s ease",
        cursor: "pointer",
        outline: riskLevel === "HIGH RISK" ? "2px solid #fca5a5" : "none",
        outlineOffset: "2px"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)")}
    >
      {/* Hospital Info Section */}
      <div style={{ marginBottom: "1rem" }}>
        {/* Hospital Name */}
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ fontSize: "1.125rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
            {hospital.name}
          </h4>
        </div>

        {/* Distance and Phone */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "#666" }}>Distance: </span>
            <span style={{ fontWeight: "600", color: "#2563eb" }}>
              {hospital.distance_km.toFixed(2)} km
            </span>
          </div>
          <div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "#666" }}>Phone: </span>
            <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
              {hospital.phone || "N/A"}
            </span>
          </div>
        </div>

        {/* Address */}
        {hospital.address && (
          <div style={{ fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            <span style={{ fontWeight: "500", color: "#666" }}>Address: </span>
            {hospital.address}
          </div>
        )}

        {/* Map Button */}
        <div style={{ paddingTop: "0.5rem" }}>
          <a
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "6px",
              background: "#2563eb",
              color: "white",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              textDecoration: "none",
              transition: "background-color 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            href={`https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lon}#map=16/${hospital.lat}/${hospital.lon}`}
            target="_blank"
            rel="noreferrer"
          >
            📍 View on Map
          </a>
        </div>
      </div>

      {/* Alert Message Section */}
      <div
        style={{
          marginTop: "1rem",
          borderRadius: "8px",
          borderLeft: "4px solid " + alertConfig.borderColor,
          background: alertConfig.bgColor,
          padding: "0.75rem",
          color: alertConfig.textColor
        }}
      >
        <p style={{ fontSize: "0.875rem", fontWeight: "700", margin: "0", lineHeight: "1.5" }}>
          {alertConfig.message}
        </p>
      </div>
    </div>
  );
};

export default NearestHospitalCard;
