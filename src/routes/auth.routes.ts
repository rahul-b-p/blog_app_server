import { Router } from 'express';
import { authController } from '../controllers';
import { validateReqBody } from '../middlewares';
import { signInSchema, signUpSchema, verifyUserSchema } from '../schemas';

const router = Router();

router.post('/sign-up/:role', validateReqBody(signUpSchema), authController.signUp);

router.post('/sign-in', validateReqBody(signInSchema), authController.signIn);

router.post('/verify', validateReqBody(verifyUserSchema), authController.verifyUser);

export default router;
