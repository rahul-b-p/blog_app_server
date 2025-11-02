import { Router } from 'express';
import { authController } from '../controllers';
import { validateReqBody } from '../middlewares';
import { signInSchema, signUpSchema, verifyUserSchema } from '../schemas';
import passport from '../config/passport';

const router = Router();

router.post('/sign-up/:role', validateReqBody(signUpSchema), authController.signUp);

router.post('/sign-in', validateReqBody(signInSchema), authController.signIn);

router.post('/verify', validateReqBody(verifyUserSchema), authController.verifyUser);

router.get(
  '/google',
  authController.initiateOAuth2('google'),
  passport.authenticate('google', { scope: ['profile', 'email'], session: false }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.oAuth2Callback,
);

router.get(
  '/facebook',
  authController.initiateOAuth2('facebook'),
  passport.authenticate('facebook', { scope: ['email'], session: false }),
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  authController.oAuth2Callback,
);

router.post('/token', authController.exchangeToken);

export default router;
