import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl
} from 'react-native';

interface LessonProgress {
  lessonId: number;
  lessonTitle: string;
  completed: boolean;
}

interface CourseProgress {
  courseId: number;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  progress: number;
  lessons: LessonProgress[];
}

const API_URL = 'http://localhost:3001';

export default function App() {
  const [userId] = useState(1);
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/progress/${userId}`);
      if (!response.ok) {
        throw new Error('Não foi possível carregar o progresso.');
      }
      const data = (await response.json()) as CourseProgress[];
      setProgress(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar progresso. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadProgress} />}
      >
        <Text style={styles.header}>Seu progresso</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {progress.map((course) => (
          <View key={course.courseId} style={styles.card}>
            <Text style={styles.title}>{course.courseTitle}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.round(course.progress * 100)}%` }]} />
            </View>
            <Text style={styles.caption}>
              {course.completedLessons} de {course.totalLessons} aulas concluídas
            </Text>
            {course.lessons.map((lesson) => (
              <Text
                key={lesson.lessonId}
                style={[styles.lesson, lesson.completed ? styles.lessonCompleted : undefined]}
              >
                {lesson.completed ? '✔️' : '○'} {lesson.lessonTitle}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f8'
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0d47a1',
    marginVertical: 24
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b1d21',
    marginBottom: 12
  },
  progressBar: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#e1e5ee',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#42a5f5'
  },
  caption: {
    marginTop: 8,
    color: '#4b5563'
  },
  lesson: {
    marginTop: 8,
    color: '#4b5563',
    fontSize: 15
  },
  lessonCompleted: {
    color: '#2e7d32'
  },
  error: {
    marginBottom: 16,
    color: '#c62828'
  }
});
