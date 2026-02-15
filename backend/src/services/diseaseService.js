const Disease = require("../models/Disease");

const DEFAULT_DISEASES = [
  {
    name: "Cholera",
    symptoms: ["diarrhea", "dehydration", "vomiting"],
    severity: "high",
    advice: "Immediate medical attention required."
  },
  {
    name: "Typhoid",
    symptoms: ["fever", "headache", "stomach pain", "fatigue"],
    severity: "medium",
    advice: "Consult doctor and avoid contaminated water."
  },
  {
    name: "Hepatitis A",
    symptoms: ["jaundice", "fatigue", "nausea"],
    severity: "medium",
    advice: "Visit hospital for liver function testing."
  },
  {
    name: "Dysentery",
    symptoms: ["diarrhea", "blood in stool", "stomach pain"],
    severity: "high",
    advice: "Urgent care recommended."
  }
];

const severityRank = { low: 1, medium: 2, high: 3 };

const normalizeSymptom = (value) => String(value || "").trim().toLowerCase();

const ensureDefaultDiseases = async () => {
  const count = await Disease.countDocuments();
  if (count > 0) {
    return;
  }

  await Disease.insertMany(DEFAULT_DISEASES);
};

const getTopMatch = async (symptoms) => {
  const normalizedSymptoms = symptoms.map(normalizeSymptom);
  const diseases = await Disease.find().lean();

  // Match diseases with at least two overlapping symptoms and rank by count and severity.
  const matches = diseases
    .map((disease) => {
      const matchCount = disease.symptoms.filter((symptom) =>
        normalizedSymptoms.includes(normalizeSymptom(symptom))
      ).length;

      return { ...disease, matchCount };
    })
    .filter((disease) => disease.matchCount >= 2)
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      return severityRank[b.severity] - severityRank[a.severity];
    });

  if (matches.length === 0) {
    return {
      diseaseName: "Healthy",
      severity: "low",
      advice: "You are currently healthy. Maintain hygiene.",
      matchCount: 0
    };
  }

  const top = matches[0];
  return {
    diseaseName: top.name,
    severity: top.severity,
    advice: top.advice,
    matchCount: top.matchCount
  };
};

module.exports = { ensureDefaultDiseases, getTopMatch };
