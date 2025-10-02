import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Lesson = {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
};

type Module = {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  description?: string | null;
  modules: Module[];
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const COURSE_ID = process.env.EXPO_PUBLIC_COURSE_ID;

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}min`;
}

export default function App() {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        if (!COURSE_ID) {
          setError('Defina EXPO_PUBLIC_COURSE_ID com o identificador do curso.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/courses/${COURSE_ID}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar curso');
        }
        const data: Course = await response.json();
        setCourse(data);
        if (data.modules.length > 0) {
          setExpandedModuleId(data.modules[0].id);
        }
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar o curso. Verifique sua conexão e o backend.');
      }
    }

    loadCourse();
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>MedFinance Cursos</Text>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>MedFinance Cursos</Text>
        <ActivityIndicator color="#38bdf8" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{course.title}</Text>
      {course.description ? <Text style={styles.description}>{course.description}</Text> : null}

      <FlatList
        data={course.modules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.module}>
            <TouchableOpacity
              onPress={() => setExpandedModuleId((prev) => (prev === item.id ? null : item.id))}
              style={styles.moduleHeader}
            >
              <Text style={styles.moduleOrder}>Módulo {item.order}</Text>
              <Text style={styles.moduleTitle}>{item.title}</Text>
            </TouchableOpacity>
            {expandedModuleId === item.id ? (
              <View style={styles.lessonList}>
                {item.lessons.map((lesson) => (
                  <TouchableOpacity
                    key={lesson.id}
                    style={styles.lesson}
                    onPress={() => Linking.openURL(lesson.videoUrl)}
                  >
                    <View>
                      <Text style={styles.lessonOrder}>#{lesson.order}</Text>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    </View>
                    <Text style={styles.lessonDuration}>{formatDuration(lesson.duration)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  description: {
    marginTop: 8,
    color: '#cbd5f5',
    fontSize: 16,
  },
  error: {
    marginTop: 16,
    color: '#f87171',
    fontSize: 16,
  },
  listContent: {
    paddingVertical: 24,
    gap: 16,
  },
  module: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleOrder: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  moduleTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  lessonList: {
    marginTop: 16,
    gap: 12,
  },
  lesson: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  lessonOrder: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  lessonTitle: {
    marginTop: 4,
    color: '#f8fafc',
    fontWeight: '600',
    maxWidth: 220,
  },
  lessonDuration: {
    color: '#fbbf24',
    fontWeight: '600',
  },
});
