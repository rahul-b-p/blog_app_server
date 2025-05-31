import express from "express";
import { morganLogger } from "./utils/logger";
import { env } from "./config/env";

const app = express();

app.set("port", env.PORT);

app.use(morganLogger);

export default app;
