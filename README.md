# E-Dr – Smart Community Health Monitoring and Early Warning System

E-Dr is a production-ready web application for early warning of water-borne diseases in rural Northeast India. Users log in, submit water habits and symptoms, and receive a risk assessment based on a curated disease dataset.

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express (MVC)
- Database: MongoDB
- Authentication: Firebase (Google + Phone OTP) with JWT sessions

## Folder Structure

- backend
  - src
    - app.js
    - server.js
    - config
    - controllers
    - middleware
    - models
    - routes
    - services
    - utils
- frontend
  - src
    - api
    - components
    - pages
    - state
    - styles

## Features

- Google and Phone OTP login (Firebase)
- Health check form with water and symptom inputs
- Disease matching with severity and advice
- Report history dashboard
- Admin panel to manage disease dataset
- Analytics chart for disease trends

## Environment Variables

Backend .env
- PORT
- MONGODB_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- CORS_ORIGIN
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

Frontend .env
- VITE_API_URL
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

## Local Development

Backend
1. Copy backend/.env.example to backend/.env and update values.
2. Install dependencies: npm install
3. Start: npm run dev

Frontend
1. Copy frontend/.env.example to frontend/.env and update values.
2. Install dependencies: npm install
3. Start: npm run dev

## Admin Setup

- Create a user via Firebase login.
- In MongoDB, set the user role to admin.
- Admins can manage disease dataset and view analytics.

## Deployment

Frontend (Vercel)
- Build command: npm run build
- Output directory: dist
- Set frontend environment variables in Vercel project settings.

Backend (Render or Railway)
- Build: npm install
- Start: npm start
- Set backend environment variables in platform settings.

MongoDB Atlas
- Create a cluster and database.
- Use the connection string for MONGODB_URI.

## Notes

- The nearest hospital section is a placeholder and can be connected to a local facility directory.
- Update disease symptoms through the admin panel to keep the system accurate.
