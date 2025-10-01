import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import * as d3 from 'd3';
import client, { getApiBaseUrl } from '../api/client';

const fallbackCourses = [
  { id: 'budgeting-101', title: 'Orçamento Inteligente', progress: 0.45 },
  { id: 'investing-basics', title: 'Investimentos Básicos', progress: 0.2 },
  { id: 'credit-strategy', title: 'Estratégias de Crédito', progress: 0.75 },
];

const CoursesScreen = () => {
  const [courses, setCourses] = useState(fallbackCourses);
  const [loading, setLoading] = useState(false);

  const colorScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, 0.5, 1])
        .range(['#F97316', '#FACC15', '#22C55E'])
        .clamp(true),
    []
  );

  const fetchCourses = async () => {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await client.get('/courses');
      if (Array.isArray(data)) {
        setCourses(
          data.map((course) => ({
            id: course.id ?? course.slug,
            title: course.title,
            progress: Number(course.progress ?? 0),
          }))
        );
      }
    } catch (error) {
      console.warn('Using fallback courses due to fetch error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const renderItem = ({ item }) => {
    const color = colorScale(item.progress);
    const percentage = Math.round(item.progress * 100);

    return (
      <View style={styles.card}>
        <View style={[styles.progressIndicator, { backgroundColor: color }]} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>Progresso: {percentage}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Seus cursos</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchCourses} />
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <Text style={styles.emptyState}>
            Nenhum curso disponível no momento. Puxe para atualizar.
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0B1F3A',
  },
  listContent: {
    paddingBottom: 24,
  },
  separator: {
    height: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
    borderRadius: 16,
    padding: 16,
  },
  progressIndicator: {
    width: 8,
    height: '100%',
    borderRadius: 4,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1F3A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555F71',
  },
  emptyState: {
    textAlign: 'center',
    color: '#5B6275',
    paddingVertical: 32,
  },
});

export default CoursesScreen;
