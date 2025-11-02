import { Router } from 'express';
import { authController } from '../controllers';
import { validateReqBody } from '../middlewares';
import { signInSchema, signUpSchema, verifyUserSchema } from '../schemas';
import passport from '../config/passport';

const router = Router();

router.post('/sign-up/:role', validateReqBody(signUpSchema), authController.signUp);
router.post('/sign-in', validateReqBody(signInSchema), authController.signIn);
router.post('/verify', validateReqBody(verifyUserSchema), authController.verifyUser);

// Google OAuth
router.get('/google', authController.initiateOAuth2('google'), (req, res, next) => {
  // Pass state to passport authenticate
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: res.locals.oauthState,
  })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.ERROR_REDIRECT_URI,
  }),
  authController.oAuth2Callback,
);

// Facebook OAuth
router.get('/facebook', authController.initiateOAuth2('facebook'), (req, res, next) => {
  // Pass state to passport authenticate
  passport.authenticate('facebook', {
    scope: ['email'],
    session: false,
    state: res.locals.oauthState, // Pass state here
  })(req, res, next);
});

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: process.env.ERROR_REDIRECT_URI,
  }),
  authController.oAuth2Callback,
);

router.post('/token', authController.exchangeToken);

export default router;
