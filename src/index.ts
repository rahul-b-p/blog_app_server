import app from "./app";
import "./config/env";
import { logger } from "./utils/logger";

const port = app.get('port');

const initializeApp = () => {
  try {
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
