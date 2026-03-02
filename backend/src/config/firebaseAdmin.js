const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

const firebaseConfigured = Boolean(projectId && clientEmail && privateKey);

if (firebaseConfigured && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
}

if (!firebaseConfigured) {
  module.exports = {
    auth: () => ({
      verifyIdToken: async () => {
        const error = new Error(
          "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY."
        );
        error.statusCode = 500;
        throw error;
      }
    })
  };
} else {
  module.exports = admin;
}
