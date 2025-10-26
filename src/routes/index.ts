import { Router } from "express";
import authRoutes from "./auth.routes";

// Using all routes
const router = Router();

router.use("/auth", authRoutes);

export default router;
