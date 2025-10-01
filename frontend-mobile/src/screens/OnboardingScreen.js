import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    id: '1',
    title: 'Aprenda no seu ritmo',
    description: 'Acesse trilhas financeiras personalizadas para os seus objetivos.',
  },
  {
    id: '2',
    title: 'Progresso inteligente',
    description: 'Saiba quais módulos revisar usando dados sobre o seu desempenho.',
  },
  {
    id: '3',
    title: 'Conteúdo confiável',
    description: 'Cursos produzidos por especialistas certificados no mercado.',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { authState } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bem-vindo{authState.user?.given_name ? `, ${authState.user.given_name}` : ''}!</Text>
      <Text style={styles.subheading}>
        Estamos prontos para impulsionar a sua educação financeira.
      </Text>
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Courses')}
      >
        <Text style={styles.buttonText}>Ver cursos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0B1F3A',
  },
  subheading: {
    fontSize: 16,
    color: '#5B6275',
    marginBottom: 24,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#F5F7FB',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0B1F3A',
  },
  cardDescription: {
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
  },
  button: {
    marginTop: 'auto',
    backgroundColor: '#0B6EFE',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
