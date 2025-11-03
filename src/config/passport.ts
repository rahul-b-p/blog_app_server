import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import env from './env';
import { authService } from '../services';
import { logger } from '../utils/logger';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.APP_URL}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const state = req.query.state as string;

        logger.debug(`Google callback - state: ${state}`);
        logger.debug(`Google callback - full query:`, req.query);

        if (!state) {
          throw new Error('State parameter missing in OAuth callback');
        }

        const role = await authService.consumeRole(state);

        logger.debug(`Retrieved role from Redis: ${role}`);

        const user = await authService.findOrCreateUser(profile, 'google', role);

        done(null, { ...user, provider: 'google' });
      } catch (error) {
        logger.error(`Google OAuth error:`, error);
        done(error as Error, undefined);
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: `${env.APP_URL}/api/auth/facebook/callback`,
      profileFields: ['id', 'emails', 'name'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const state = req.query.state as string;

        logger.debug(`Facebook callback - state: ${state}`);
        logger.debug(`Facebook callback - full query:`, req.query);

        if (!state) {
          throw new Error('State parameter missing in OAuth callback');
        }

        const role = await authService.consumeRole(state);

        logger.debug(`Retrieved role from Redis: ${role}`);

        const user = await authService.findOrCreateUser(profile, 'facebook', role);

        done(null, { ...user, provider: 'facebook' });
      } catch (error) {
        logger.error(`Facebook OAuth error:`, error);
        done(error as Error, undefined);
      }
    },
  ),
);

export default passport;
