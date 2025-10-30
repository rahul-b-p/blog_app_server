import { Router } from "express";
import { authController } from "../controllers";
import { validateReqBody } from "../middlewares";
import { signUpSchema } from "../schemas";

const router = Router();

router.post(
  "/sign-up/:role",
  validateReqBody(signUpSchema),
  authController.signUp
);

export default router;
