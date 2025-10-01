import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Auth0 from 'expo-auth-session/providers/auth0';
import { useNavigation } from '@react-navigation/native';
import { auth0Config } from '../config/auth0Config';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setAuthState } = useAuth();
  const config = useMemo(() => auth0Config, []);

  const [request, response, promptAsync] = Auth0.useAuthRequest({
    clientId: config.clientId,
    domain: config.domain,
    scopes: config.scopes,
    audience: config.audience,
    redirectUri: config.redirectUri,
    usePKCE: true,
    responseType: 'token',
  });

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success' && response.authentication?.accessToken) {
        const accessToken = response.authentication.accessToken;
        let user = null;

        try {
          const userInfoResponse = await fetch(`https://${config.domain}/userinfo`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (userInfoResponse.ok) {
            user = await userInfoResponse.json();
          }
        } catch (error) {
          console.warn('Failed to fetch user info', error);
        }

        setAuthState({ accessToken, user });
        navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
      }
    };

    handleResponse();
  }, [config.domain, navigation, response, setAuthState]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MedFinance</Text>
      <Text style={styles.subtitle}>Gerencie seus cursos de finanças com segurança.</Text>
      <TouchableOpacity
        style={[styles.button, !request && styles.buttonDisabled]}
        onPress={() => promptAsync({ useProxy: config.useProxy })}
        disabled={!request}
      >
        <Text style={styles.buttonText}>Entrar com Auth0</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B6EFE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f4ff',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0B6EFE',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
