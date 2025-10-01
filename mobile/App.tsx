import { useCallback, useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Auth0 from 'react-native-auth0';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { ProfileSelector } from './src/components/ProfileSelector';
import { useWarmUpBrowser } from './src/hooks/useWarmUpBrowser';
import { fetchUserProfile, saveUserProfile } from './src/api/client';
import { decode as base64Decode } from 'base-64';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

type Profile = 'STUDENT' | 'RECENT_GRAD' | 'SPECIALIST';

type AuthUser = {
  id: string;
  name?: string;
  given_name?: string;
};

const auth0Domain = Constants.expoConfig?.extra?.auth0Domain as string;
const auth0ClientId = Constants.expoConfig?.extra?.auth0ClientId as string;
const apiUrl = (Constants.expoConfig?.extra?.apiUrl as string) ?? 'http://localhost:3333';

const auth0 = new Auth0({ domain: auth0Domain, clientId: auth0ClientId });

export default function App() {
  useWarmUpBrowser();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    try {
      const redirectUri = makeRedirectUri({
        scheme: 'medfinance',
        useProxy: true,
      });

      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: Constants.expoConfig?.extra?.auth0Audience,
        redirectUri,
      });

      if (credentials?.idToken) {
        await SecureStore.setItemAsync('medfinance_access_token', credentials.idToken);
        const decoded = parseJwt(credentials.idToken);
        setUser({
          id: decoded?.sub,
          name: decoded?.name,
          given_name: decoded?.given_name,
        });
      }
    } catch (err) {
      console.warn('Erro no login', err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth0.webAuth.clearSession();
    } catch (err) {
      console.warn('Erro ao encerrar sessão', err);
    } finally {
      await SecureStore.deleteItemAsync('medfinance_access_token');
      setUser(null);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      setLoadingProfile(true);
      try {
        const response = await fetchUserProfile(apiUrl, user.id);
        setProfile(response?.profile ?? null);
      } catch (err) {
        console.warn('Não foi possível carregar perfil', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleSelectProfile = async (selectedProfile: Profile) => {
    if (!user?.id) return;

    try {
      setSaving(true);
      setError(null);
      const response = await saveUserProfile(apiUrl, user.id, selectedProfile);
      setProfile(response.profile);
    } catch (err) {
      console.warn(err);
      setError('Não foi possível salvar seu perfil.');
    } finally {
      setSaving(false);
    }
  };

  const greeting = profile && user?.given_name
    ? `Bem-vindo(a), ${user.given_name}! Perfil: ${resolveProfileLabel(profile)}`
    : null;

  return (
    <SafeAreaView style={styles.container}>
      {!user ? (
        <View style={styles.block}>
          <Text style={styles.title}>MedFinance</Text>
          <Text style={styles.subtitle}>Entre para personalizar sua experiência.</Text>
          <Button title="Entrar" onPress={login} />
        </View>
      ) : (
        <View style={styles.block}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>MedFinance</Text>
            <Button onPress={logout} title="Sair" />
          </View>
          {!profile ? (
            <>
              <Text style={styles.subtitle}>Qual é o seu momento profissional?</Text>
              <ProfileSelector
                disabled={saving || loadingProfile}
                onSelect={handleSelectProfile}
                selectedProfile={profile}
              />
              {loadingProfile && <Text>Carregando opções...</Text>}
              {error && <Text style={styles.error}>{error}</Text>}
            </>
          ) : (
            <>
              {greeting && <Text style={styles.subtitle}>{greeting}</Text>}
              <Text style={styles.body}>
                Explore conteúdos alinhados ao seu perfil de {resolveProfileLabel(profile)}.
              </Text>
              <Button title="Alterar perfil" onPress={() => setProfile(null)} />
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

function parseJwt(token?: string) {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  if (!base64Url) return null;
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  try {
    const jsonPayload = base64Decode(paddedBase64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.warn('Erro ao decodificar token', error);
    return null;
  }
}

function resolveProfileLabel(profile: Profile) {
  switch (profile) {
    case 'STUDENT':
      return 'estudante';
    case 'RECENT_GRAD':
      return 'recém-formado(a)';
    case 'SPECIALIST':
      return 'especialista';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
  },
  block: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 18,
    color: '#1e293b',
  },
  body: {
    fontSize: 16,
    color: '#334155',
  },
  error: {
    color: '#ef4444',
  },
});
