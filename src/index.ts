import app from "./app";
import { connectDB } from "./config/database";
import "./config/env";
import { initializeMapping } from "./mapping";
import { createDefaultAdmin } from "./utils/defaultAdmin";
import { logger } from "./utils/logger";

const port = app.get("port");

const initializeApp = async () => {
  try {
    // Connect DB
    await connectDB();

    // Initializes the mapping
    initializeMapping();

    // Default Admin creation
    await createDefaultAdmin();

    // listen server
    app.listen(port, () => {
      logger.info(`app running at port:${port}`);
    });
  } catch (error) {
    logger.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

// Start the application
initializeApp();


// Handle uncaught errors
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});
