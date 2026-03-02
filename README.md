# EDR – Emergency Disease Response

EDR is a fullstack early-detection platform for waterborne disease prevention. It combines symptom-based risk assessment, state pollution monitoring, government/user alerting, hospital discovery by location, and health report history.

## Stack

- Frontend: React + Vite + Axios + Recharts
- Backend: Node.js + Express + JWT auth middleware
- Database: MongoDB Atlas (Mongoose)
- Authentication: Google OAuth via Firebase Auth + backend JWT session
- Email Alerts: Nodemailer with Gmail SMTP
- Location Services: Browser Geolocation + OpenStreetMap Overpass API

## Implemented Features

1. **Google Login + Biodata onboarding** for new users
2. **Dashboard** with latest risk, state pollution status, alerts, and history
3. **Water Pollution Monitoring** chart for all states
4. **Government Alert System** when pollution level is `Danger`
5. **Online Health Check** with symptom-based risk classification (`LOW/MEDIUM/HIGH`)
6. **Hospital Recommendation** based on user geolocation
7. **User Email Alert** for `HIGH RISK` reports
8. **Health Report History** list + chart view
9. **Admin Panel** to manage pollution data, government contacts, and view users/reports
10. **Responsive UI** with dark/light mode toggle

## Data Models

- `User`
- `HealthReport`
- `WaterPollution`
- `GovernmentContact`

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` and fill values:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` and fill values:

- `VITE_API_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Local Run

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment

- Frontend deploy target: Vercel
- Backend deploy target: Render or Railway
- Database: MongoDB Atlas

Set environment variables on hosting platforms exactly as local `.env`.
