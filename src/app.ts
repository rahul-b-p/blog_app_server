import express from "express";
import { morganLogger } from "./utils/logger";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares";

const app = express();

app.set("port", env.PORT);

app.use(morganLogger);

// not found handler
app.use(notFoundHandler);
// error handler
app.use(errorHandler);

export default app;
