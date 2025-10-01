import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

const useProxy = Platform.select({ web: false, default: true });

export const auth0Config = {
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'YOUR_AUTH0_DOMAIN',
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'YOUR_AUTH0_CLIENT_ID',
  audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE,
  scopes: ['openid', 'profile', 'email'],
  redirectUri: AuthSession.makeRedirectUri({
    useProxy,
    native: 'com.medfinance.mobile://auth',
  }),
  useProxy,
};
