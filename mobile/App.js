import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = 'http://localhost:3001/contents';

const PROFILES = [
  { id: 'estudante', label: 'Estudante' },
  { id: 'recem-formado', label: 'Recém-formado' },
  { id: 'especialista', label: 'Especialista' }
];

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState(PROFILES[0].id);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadCourses(profile) {
    setLoading(true);
    setError('');
    setCourses([]);

    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(profile)}`);

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.message || 'Erro ao buscar cursos');
      }

      const data = await response.json();
      setCourses(data.courses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses(selectedProfile);
  }, [selectedProfile]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Conteúdos MedFinance</Text>
      <Text style={styles.subtitle}>Selecione o perfil para visualizar os cursos recomendados.</Text>

      <View style={styles.profileRow}>
        {PROFILES.map((profile) => {
          const isActive = selectedProfile === profile.id;
          return (
            <Pressable
              key={profile.id}
              style={[styles.profileButton, isActive && styles.profileButtonActive]}
              onPress={() => setSelectedProfile(profile.id)}
            >
              <Text style={[styles.profileButtonText, isActive && styles.profileButtonTextActive]}>
                {profile.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading && <ActivityIndicator size="large" color="#14b8a6" style={styles.spinner} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardDuration}>Duração: {item.duration}</Text>
          </View>
        )}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.empty}>Nenhum curso disponível para este perfil.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 64,
    paddingHorizontal: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5f5',
    marginBottom: 24
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  profileButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#1e293b'
  },
  profileButtonActive: {
    backgroundColor: '#14b8a6'
  },
  profileButtonText: {
    textAlign: 'center',
    color: '#e2e8f0',
    fontWeight: '600'
  },
  profileButtonTextActive: {
    color: '#0f172a'
  },
  spinner: {
    marginVertical: 16
  },
  error: {
    color: '#f87171',
    marginBottom: 12
  },
  list: {
    paddingBottom: 32
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#14b8a6'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc'
  },
  cardDescription: {
    marginTop: 8,
    color: '#cbd5f5'
  },
  cardDuration: {
    marginTop: 12,
    fontWeight: '600',
    color: '#38bdf8'
  },
  empty: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24
  }
});
