import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const AuthContext = React.createContext(null);

function useSaldo() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useSaldo deve ser usado dentro de um AuthProvider');
  }
  return context;
}

function AuthProvider({ children }) {
  const [saldo, setSaldo] = useState(0);
  const atualizarSaldo = valor => setSaldo(prev => prev + valor);

  const value = useMemo(() => ({ saldo, atualizarSaldo }), [saldo]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const profiles = [
  { value: 'student', label: 'Estudante' },
  { value: 'admin', label: 'Gestor' }
];

function Dashboard() {
  const { saldo, atualizarSaldo } = useSaldo();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Finanças Médicas</Text>
          <Text style={styles.subtitle}>Saldo atual: R${saldo.toFixed(2)}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={() => atualizarSaldo(100)}>
            <Text style={styles.buttonText}>Adicionar R$100</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => atualizarSaldo(-50)}>
            <Text style={styles.buttonText}>Remover R$50</Text>
          </TouchableOpacity>
        </View>
        <ContentRecommendations />
      </View>
    </SafeAreaView>
  );
}

function ContentRecommendations() {
  const [profile, setProfile] = useState('student');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchContent() {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/content?profile=${profile}`);
        if (!response.ok) {
          throw new Error('Falha na API');
        }
        const data = await response.json();
        if (active) {
          setItems(data.items);
          setError(null);
        }
      } catch (_error) {
        if (active) {
          setItems([]);
          setError('Não foi possível carregar os conteúdos.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchContent();

    return () => {
      active = false;
    };
  }, [profile]);

  return (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Conteúdos recomendados</Text>
      <View style={styles.profileTabs}>
        {profiles.map((option) => {
          const isActive = profile === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              accessibilityRole="button"
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setProfile(option.value)}
            >
              <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {loading && <Text style={styles.statusText}>Carregando conteúdos...</Text>}
      {!!error && !loading && <Text style={[styles.statusText, styles.statusError]}>{error}</Text>}
      {!loading && !error && (
        <View style={styles.recommendationList}>
          {items.map((item) => (
            <View key={item.id} style={styles.recommendationCard}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 24,
    paddingVertical: 48
  },
  contentWrapper: {
    flex: 1
  },
  header: {
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a'
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: '#475569'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  contentSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 4,
    marginTop: 32
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center'
  },
  profileTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 6
  },
  tabButtonActive: {
    backgroundColor: '#2563eb'
  },
  tabButtonText: {
    color: '#1e293b',
    fontWeight: '600'
  },
  tabButtonTextActive: {
    color: '#ffffff'
  },
  statusText: {
    textAlign: 'center',
    color: '#475569',
    marginTop: 16
  },
  statusError: {
    color: '#dc2626'
  },
  recommendationList: {
    marginTop: 16
  },
  recommendationCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#f8fafc',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#0f172a'
  },
  cardDescription: {
    color: '#475569',
    lineHeight: 20
  }
});
