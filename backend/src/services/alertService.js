const GovernmentContact = require("../models/GovernmentContact");
const { sendEmail } = require("./emailService");

const notifyGovernmentOnDanger = async ({ state, pollutionLevel, date }) => {
  if (pollutionLevel !== "Danger") {
    return;
  }

  const contact = await GovernmentContact.findOne({ state }).lean();
  if (!contact?.official_email) {
    return;
  }

  await sendEmail({
    to: contact.official_email,
    subject: `EDR ALERT: Danger Pollution in ${state}`,
    html: `
      <h2>Emergency Disease Response - Government Alert</h2>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Pollution Level:</strong> ${pollutionLevel}</p>
      <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
      <p><strong>Recommended Action:</strong> Issue emergency public advisory, deploy water quality response teams, and increase medical readiness.</p>
    `
  });
};

const notifyUserOnHighRisk = async ({ email, riskLevel, hospitals = [] }) => {
  if (riskLevel !== "HIGH RISK" || !email) {
    return;
  }

  const hospitalsHtml = hospitals.length
    ? `<ul>${hospitals
        .map(
          (hospital) =>
            `<li>${hospital.name} - ${hospital.distance_km} km - ${hospital.phone || "Not Available"}</li>`
        )
        .join("")}</ul>`
    : "<p>No nearby hospitals found from location data.</p>";

  await sendEmail({
    to: email,
    subject: "URGENT HEALTH ALERT",
    html: `
      <h2>Urgent Health Alert</h2>
      <p><strong>Risk Level:</strong> ${riskLevel}</p>
      <p><strong>Precautions:</strong> Stay hydrated, avoid contaminated water sources, and seek immediate medical care.</p>
      <h3>Nearest Hospitals</h3>
      ${hospitalsHtml}
    `
  });
};

module.exports = { notifyGovernmentOnDanger, notifyUserOnHighRisk };
