import { Profile } from 'passport';
import { UserRole } from '../enums';
import { UserDto } from '../mapping/dtos';

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
  user?: UserDto;
  profile?: Profile;
  provider?: 'google' | 'facebook';
}
