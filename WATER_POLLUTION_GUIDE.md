# Water Pollution Monitoring Feature - Setup Guide

## Feature Overview

The Water Pollution Monitoring feature enables:
- ✅ Track water quality across Indian states
- ✅ Automatic classification (EDIBLE / MODERATE / NON EDIBLE)
- ✅ Dynamic alert messages based on water quality
- ✅ Integration with health risk assessment
- ✅ Admin panel for data management
- ✅ Professional Water Safety Dashboard

---

## API Endpoints

### Public Routes

#### Get All States Water Data
```
GET /api/water-pollution
```
Returns latest water quality data for all states.

#### Get Specific State Water Data
```
GET /api/water-pollution/state/{state}
```
Returns latest water quality data for a specific state.

#### Get State Water History
```
GET /api/water-pollution/history/{state}?limit=10
```
Returns historical water quality data for a state.

#### Get Water Risk Assessment
```
GET /api/water-pollution/assessment/state?state={stateName}
```
Returns water risk level for user's state.

### Admin Routes (Protected - Requires Admin Role)

#### Add Water Quality Data
```
POST /api/water-pollution/add
Content-Type: application/json

{
  "state": "Maharashtra",
  "water_quality_index": 75,
  "ph_level": 7.2,
  "contamination_level": "Low",
  "date": "2026-03-02T10:00:00",
  "dissolved_oxygen": 8.5,
  "turbidity": 1.2,
  "total_hardness": 120,
  "chlorine_residual": 0.5,
  "notes": "Regular testing"
}
```

#### Bulk Import Water Data
```
POST /api/water-pollution/import
Content-Type: application/json

{
  "data": [
    { "state": "Maharashtra", "water_quality_index": 75, ... },
    { "state": "Karnataka", "water_quality_index": 68, ... }
  ]
}
```

#### Delete Water Record
```
DELETE /api/water-pollution/{recordId}
```

---

## Sample Data for Indian States

```json
{
  "data": [
    {
      "state": "Maharashtra",
      "water_quality_index": 78,
      "ph_level": 7.1,
      "contamination_level": "Low",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 8.5,
      "turbidity": 1.2,
      "total_hardness": 120,
      "chlorine_residual": 0.5
    },
    {
      "state": "Karnataka",
      "water_quality_index": 72,
      "ph_level": 7.0,
      "contamination_level": "Low",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 8.0,
      "turbidity": 1.5,
      "total_hardness": 110,
      "chlorine_residual": 0.4
    },
    {
      "state": "Tamil Nadu",
      "water_quality_index": 55,
      "ph_level": 7.3,
      "contamination_level": "Moderate",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 6.5,
      "turbidity": 3.0,
      "total_hardness": 150,
      "chlorine_residual": 0.3
    },
    {
      "state": "West Bengal",
      "water_quality_index": 35,
      "ph_level": 6.8,
      "contamination_level": "High",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 4.5,
      "turbidity": 5.2,
      "total_hardness": 200,
      "chlorine_residual": 0.1
    },
    {
      "state": "Punjab",
      "water_quality_index": 68,
      "ph_level": 7.2,
      "contamination_level": "Low",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 7.8,
      "turbidity": 1.8,
      "total_hardness": 130,
      "chlorine_residual": 0.5
    },
    {
      "state": "Gujarat",
      "water_quality_index": 71,
      "ph_level": 7.0,
      "contamination_level": "Low",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 8.2,
      "turbidity": 1.3,
      "total_hardness": 115,
      "chlorine_residual": 0.5
    },
    {
      "state": "Rajasthan",
      "water_quality_index": 45,
      "ph_level": 7.4,
      "contamination_level": "Moderate",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 6.0,
      "turbidity": 3.5,
      "total_hardness": 180,
      "chlorine_residual": 0.2
    },
    {
      "state": "Uttar Pradesh",
      "water_quality_index": 38,
      "ph_level": 6.9,
      "contamination_level": "High",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 4.8,
      "turbidity": 4.8,
      "total_hardness": 190,
      "chlorine_residual": 0.2
    },
    {
      "state": "Bihar",
      "water_quality_index": 30,
      "ph_level": 6.7,
      "contamination_level": "High",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 3.5,
      "turbidity": 6.5,
      "total_hardness": 220,
      "chlorine_residual": 0.0
    },
    {
      "state": "Delhi",
      "water_quality_index": 65,
      "ph_level": 7.1,
      "contamination_level": "Moderate",
      "date": "2026-03-02T00:00:00",
      "dissolved_oxygen": 7.0,
      "turbidity": 2.2,
      "total_hardness": 140,
      "chlorine_residual": 0.4
    }
  ]
}
```

---

## Classification Logic

### EDIBLE (Green Alert)
- Water Quality Index ≥ 70
- pH Level: 6.5 - 8.5
- Contamination: Low
- Status: SAFE
- Message: "✅ Water is safe for drinking"

### MODERATE (Yellow Alert)
- Water Quality Index: 40 - 69
- May have some contamination
- Status: BOIL BEFORE DRINKING
- Message: "⚠️ Boil water before drinking"

### NON EDIBLE (Red Alert)
- Water Quality Index < 40
- OR Contamination Level: High
- Status: UNSAFE
- Message: "🚨 Water is unsafe for drinking. Use bottled or treated water."

---

## Frontend Pages

### 1. Water Safety Dashboard
- **Route**: `/app/water-safety`
- **Features**:
  - Bar chart showing all states' water quality index
  - State cards with quick summary
  - Detailed state analysis with additional metrics
  - Color-coded alerts based on edibility

### 2. Admin Panel - Water Quality Data Entry
- **Route**: `/app/admin`
- **Features**:
  - Comprehensive form for water quality data
  - Fields: State, WQI, pH, Contamination, DO, Turbidity, Hardness, Chlorine
  - Submit and view success/error messages

---

## Integration with Health Risk Assessment

When a user performs a health check:
1. System fetches user's state
2. Checks water quality level for that state
3. If water is NON EDIBLE → Increases disease risk by 30%
4. If water is MODERATE → Increases disease risk by 15%
5. Displays alert on result page

---

## Running Locally

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## Deployment

### Vercel (Frontend)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Render/Railway (Backend)
```bash
Set environment variables:
- MONGODB_URI
- JWT_SECRET
- CORS_ORIGIN
- FIREBASE_* keys
- SMTP_* keys
```

---

## Data Quality Parameters

- **Water Quality Index**: 0-100 scale
- **pH Level**: 0-14 scale (6.5-8.5 is ideal)
- **Contamination**: Low / Moderate / High
- **Dissolved Oxygen**: mg/L
- **Turbidity**: NTU (Nephelometric Turbidity Units)
- **Total Hardness**: mg/L (CaCO₃ equivalent)
- **Chlorine Residual**: mg/L

---

## Monitoring Best Practices

1. **Update Frequency**: Weekly or after rain events
2. **Data Source**: Government testing agencies, NWDA, local water boards
3. **Testing Agency**: Record which agency conducted the test
4. **Alert Threshold**: Monitor pollution spikes
5. **Historical Tracking**: Maintain 6+ months of data for trend analysis

---

## Features Added to Existing E-Dr

✅ Water Pollution Monitoring Integration
✅ Professional Water Safety Dashboard  
✅ Admin Data Management
✅ Health Risk Integration
✅ Dynamic Alert System
✅ Responsive Design
✅ Production-Ready APIs
✅ Complete Deployment Instructions

---

**Status**: ✅ Fully Implemented & Production Ready
