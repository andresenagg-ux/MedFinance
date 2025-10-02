import { useEffect, useState } from 'react';
import axios from 'axios';

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

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}min`;
}

function App() {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        const courseId = import.meta.env.VITE_COURSE_ID;
        if (!courseId) {
          setError('Configure VITE_COURSE_ID com o identificador do curso desejado.');
          return;
        }

        const response = await axios.get<Course>(`${API_BASE_URL}/courses/${courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar o curso. Verifique o backend.');
      }
    }

    loadCourse();
  }, []);

  if (error) {
    return (
      <div className="container">
        <h1>MedFinance Cursos</h1>
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container">
        <h1>MedFinance Cursos</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>{course.title}</h1>
        {course.description && <p className="description">{course.description}</p>}
      </header>
      <div className="modules">
        {course.modules.map((module) => (
          <details key={module.id} open>
            <summary>
              <span>Módulo {module.order}</span>
              <strong>{module.title}</strong>
            </summary>
            <ul>
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <div>
                    <span className="lesson-order">#{lesson.order}</span>
                    <div className="lesson-info">
                      <p className="lesson-title">{lesson.title}</p>
                      <a href={lesson.videoUrl} target="_blank" rel="noreferrer">
                        Assistir vídeo
                      </a>
                    </div>
                  </div>
                  <span className="duration">{formatDuration(lesson.duration)}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}

export default App;
