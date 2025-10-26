import { Router } from "express";
import { authController } from "../controllers";

const router = Router();

router.post("/sign-up/:role", authController.signUp);

export default router;
