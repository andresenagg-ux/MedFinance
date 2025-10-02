import React, { useEffect, useState } from 'react';
import CoursePage from './pages/CoursePage.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

export default function App() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`${API_BASE_URL}/courses/1`);
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

  if (loading) {
    return <p>Carregando curso...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  if (!course) {
    return <p>Curso não encontrado.</p>;
  }

  return <CoursePage course={course} />;
}
