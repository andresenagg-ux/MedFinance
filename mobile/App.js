import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import VimeoPlayer from './src/components/VimeoPlayer';

const COURSE_API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/courses/1';

export default function App() {
  const [course, setCourse] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(COURSE_API_URL);
        if (!response.ok) {
          throw new Error('Não foi possível carregar o curso.');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Text>Carregando curso...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {course && (
        <View style={styles.content}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description}>{course.description}</Text>
          {course.videoUrl ? (
            <VimeoPlayer videoUrl={course.videoUrl} />
          ) : (
            <Text style={styles.message}>Este curso ainda não possui vídeo.</Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  content: {
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#555555',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
  error: {
    color: 'red',
  },
});
