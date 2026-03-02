const toRadians = (value) => (value * Math.PI) / 180;

const distanceKm = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const fetchNearestHospitals = async ({ latitude, longitude, limit = 5 }) => {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return [];
  }

  const delta = 0.2;
  const query = `[out:json][timeout:25];\n(\n  node[\"amenity\"=\"hospital\"](${latitude - delta},${longitude - delta},${latitude + delta},${longitude + delta});\n  way[\"amenity\"=\"hospital\"](${latitude - delta},${longitude - delta},${latitude + delta},${longitude + delta});\n  relation[\"amenity\"=\"hospital\"](${latitude - delta},${longitude - delta},${latitude + delta},${longitude + delta});\n);\nout center tags;`;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: query
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const hospitals = (data.elements || [])
    .map((item) => {
      const lat = item.lat || item.center?.lat;
      const lon = item.lon || item.center?.lon;
      if (typeof lat !== "number" || typeof lon !== "number") {
        return null;
      }

      const km = distanceKm(latitude, longitude, lat, lon);
      return {
        name: item.tags?.name || "Unnamed Hospital",
        phone: item.tags?.phone || item.tags?.["contact:phone"] || "Not Available",
        lat,
        lon,
        distance_km: Number(km.toFixed(2))
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);

  return hospitals;
};

module.exports = { fetchNearestHospitals };
