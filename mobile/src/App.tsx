import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Switch,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:4000';
const USER_ID_KEY = 'medfinance_user_id';
const CONSENT_STATUS_KEY = 'medfinance_consent_status';

type ConsentState = 'accepted' | 'rejected' | 'unknown';

type ConsentPayload = {
  id: number;
  userId: string;
  consented: boolean;
  createdAt: string;
};

const ensureRandomUser = async (): Promise<string> => {
  const stored = await AsyncStorage.getItem(USER_ID_KEY);
  if (stored) return stored;
  const newId = `user-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(USER_ID_KEY, newId);
  return newId;
};

const registerConsent = async (userId: string, consented: boolean): Promise<ConsentPayload> => {
  const response = await fetch(`${API_BASE_URL}/consents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, consented })
  });

  if (!response.ok) {
    throw new Error('Falha ao registrar consentimento');
  }

  return response.json();
};

const revokeConsent = async (userId: string): Promise<ConsentPayload> => {
  const response = await fetch(`${API_BASE_URL}/consents/${userId}/revoke`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Falha ao revogar consentimento');
  }

  return response.json();
};

const fetchConsent = async (userId: string): Promise<ConsentPayload | null> => {
  const response = await fetch(`${API_BASE_URL}/consents/${userId}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Erro ao buscar consentimento');
  }
  return response.json();
};

const App = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [consentState, setConsentState] = useState<ConsentState>('unknown');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const id = await ensureRandomUser();
      setUserId(id);
      const stored = await AsyncStorage.getItem(CONSENT_STATUS_KEY);

      try {
        const consent = await fetchConsent(id);
        if (consent) {
          const state = consent.consented ? 'accepted' : 'rejected';
          setConsentState(state);
          await AsyncStorage.setItem(CONSENT_STATUS_KEY, state);
          setShowBanner(!consent.consented);
        } else {
          setConsentState('unknown');
          setShowBanner(true);
        }
      } catch (error) {
        if (stored === 'accepted' || stored === 'rejected') {
          setConsentState(stored as ConsentState);
          setShowBanner(stored !== 'accepted');
        } else {
          setConsentState('unknown');
          setShowBanner(true);
        }
        setErrorMessage('Não foi possível sincronizar com o servidor de consentimento.');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const consentToggle = useMemo(() => consentState === 'accepted', [consentState]);

  const handlePersistState = async (state: ConsentState) => {
    setConsentState(state);
    await AsyncStorage.setItem(CONSENT_STATUS_KEY, state);
  };

  const handleAccept = async () => {
    if (!userId) return;
    setUpdating(true);
    setErrorMessage(null);
    try {
      await registerConsent(userId, true);
      await handlePersistState('accepted');
      setShowBanner(false);
    } catch (error) {
      setErrorMessage('Não foi possível salvar seu consentimento.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSavePreferences = async (consented: boolean) => {
    if (!userId) return;
    setUpdating(true);
    setErrorMessage(null);
    try {
      if (consented) {
        await registerConsent(userId, true);
        await handlePersistState('accepted');
        setShowBanner(false);
      } else {
        await revokeConsent(userId);
        await handlePersistState('rejected');
        setShowBanner(true);
      }
      setShowPreferences(false);
    } catch (error) {
      setErrorMessage('Erro ao atualizar suas preferências.');
    } finally {
      setUpdating(false);
    }
  };

  const handleRevoke = async () => {
    if (!userId) return;
    setUpdating(true);
    setErrorMessage(null);
    try {
      await revokeConsent(userId);
      await handlePersistState('rejected');
      setShowBanner(true);
    } catch (error) {
      setErrorMessage('Erro ao revogar consentimento.');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleFromSettings = async (value: boolean) => {
    if (value) {
      await handleAccept();
    } else {
      await handleRevoke();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>MedFinance</Text>
        <Text style={styles.subtitle}>
          Controle seus aprendizados financeiros e personalize as recomendações
          com base nas suas preferências de privacidade.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações de privacidade</Text>
          <Text style={styles.sectionDescription}>
            Gerencie a coleta de dados que utilizamos para análises de uso e
            sugestões personalizadas. Você pode alterar o consentimento a
            qualquer momento.
          </Text>

          <View style={styles.preferenceRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.preferenceTitle}>Analytics e personalização</Text>
              <Text style={styles.preferenceDescription}>
                Permite que o MedFinance utilize dados de navegação para gerar
                insights financeiros e recomendações sob medida.
              </Text>
            </View>
            <Switch
              testID="consent-switch"
              value={consentToggle}
              onValueChange={handleToggleFromSettings}
              disabled={updating}
            />
          </View>

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando preferências…</Text>
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={showBanner} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Controlamos os seus dados</Text>
            <Text style={styles.modalText}>
              Utilizamos dados de uso para melhorar a plataforma, personalizar
              conteúdos e cumprir obrigações legais. Você pode revogar o
              consentimento a qualquer momento nesta tela.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.button, styles.primary]} onPress={handleAccept}>
                <Text style={styles.primaryText}>Aceitar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.secondary]}
                onPress={() => setShowPreferences(true)}
              >
                <Text style={styles.secondaryText}>Gerenciar preferências</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showPreferences} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.preferencesCard}>
            <Text style={styles.modalTitle}>Gerenciar preferências</Text>
            <Text style={styles.modalText}>
              Escolha se deseja permitir a coleta de dados para análises e
              recomendações personalizadas.
            </Text>
            <View style={styles.preferenceRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.preferenceTitle}>Analytics</Text>
                <Text style={styles.preferenceDescription}>
                  Permitir coleta e personalização de conteúdos.
                </Text>
              </View>
              <Switch
                value={consentToggle}
                onValueChange={(value) => handleSavePreferences(value)}
                disabled={updating}
              />
            </View>
            <Pressable style={styles.closeButton} onPress={() => setShowPreferences(false)}>
              <Text style={styles.secondaryText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  container: {
    padding: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0f172a'
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 24,
    lineHeight: 24
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0f172a'
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16
  },
  preferenceRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18
  },
  error: {
    marginTop: 16,
    color: '#dc2626'
  },
  loading: {
    marginTop: 24,
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 8,
    color: '#475569'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    justifyContent: 'center',
    padding: 24
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    gap: 16
  },
  preferencesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    gap: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a'
  },
  modalText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center'
  },
  primary: {
    backgroundColor: '#2563eb'
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16
  },
  secondary: {
    backgroundColor: '#e2e8f0'
  },
  secondaryText: {
    color: '#1e293b',
    fontWeight: '600'
  },
  closeButton: {
    alignSelf: 'flex-end'
  }
});

export default App;
