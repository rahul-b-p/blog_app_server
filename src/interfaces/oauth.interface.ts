import { Profile } from 'passport';
import { UserRole } from '../enums';

export interface OAuth2Token {
  userId: string;
  email: string;
  role: UserRole;
  provider: 'google' | 'facebook';
  createdAt: number;
}

export interface OAuthProfile {
  id: string;
  displayName?: string;
  name?: { givenName: string; familyName: string };
  emails?: Array<{ value: string }>;
}

export interface OAuthUser {
  profile?: Profile;
  provider?: 'google' | 'facebook';
}
