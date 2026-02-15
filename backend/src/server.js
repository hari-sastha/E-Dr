require("dotenv").config();
const app = require("./app");
const connectDb = require("./config/db");
const { ensureDefaultDiseases } = require("./services/diseaseService");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();
    await ensureDefaultDiseases();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
