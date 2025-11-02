import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import env from './env';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      done(null, { profile, provider: 'google' });
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      done(null, { profile, provider: 'facebook' });
    },
  ),
);

export default passport;
