import React from 'react';
import VimeoPlayer from '../components/VimeoPlayer.jsx';

export default function CoursePage({ course }) {
  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>
      <header>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </header>

      {course.videoUrl ? (
        <section>
          <h2>Aula em vídeo</h2>
          <VimeoPlayer videoUrl={course.videoUrl} />
        </section>
      ) : (
        <p>Este curso ainda não possui vídeo disponível.</p>
      )}
    </main>
  );
}
