const API_URL = 'http://localhost:3001/contents';

const form = document.getElementById('profile-form');
const feedbackEl = document.getElementById('feedback');
const coursesEl = document.getElementById('courses');

function renderCourses(courses) {
  if (!Array.isArray(courses) || courses.length === 0) {
    coursesEl.innerHTML = '<p>Nenhum curso encontrado para este perfil.</p>';
    return;
  }

  const template = courses
    .map(
      (course) => `
      <article class="course-card">
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <p class="duration">Duração: ${course.duration}</p>
      </article>
    `
    )
    .join('');

  coursesEl.innerHTML = template;
}

async function fetchCourses(profile) {
  feedbackEl.textContent = 'Carregando cursos...';
  coursesEl.innerHTML = '';

  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(profile)}`);

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload.message || 'Erro ao buscar cursos.');
    }

    const data = await response.json();
    feedbackEl.textContent = `Exibindo ${data.courses.length} curso(s) para o perfil "${profile}".`;
    renderCourses(data.courses);
  } catch (error) {
    feedbackEl.textContent = error.message;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const profile = new FormData(form).get('profile');
  fetchCourses(profile);
});

// Busca inicial padrão
fetchCourses(form.profile.value);
