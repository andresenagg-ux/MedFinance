const API_URL = 'http://localhost:3001';

const courseTemplate = document.getElementById('courseTemplate');
const coursesContainer = document.getElementById('coursesContainer');
const errorMessage = document.getElementById('errorMessage');
const userIdInput = document.getElementById('userIdInput');
const reloadButton = document.getElementById('reloadButton');

let courseCatalog = [];
let courses = [];

async function loadData() {
  const userId = Number(userIdInput.value) || 1;
  toggleLoading(true);
  try {
    const [coursesResponse, progressResponse] = await Promise.all([
      fetch(`${API_URL}/courses`),
      fetch(`${API_URL}/progress/${userId}`)
    ]);

    if (!coursesResponse.ok) {
      throw new Error('Não foi possível carregar os cursos.');
    }

    if (!progressResponse.ok) {
      throw new Error('Não foi possível carregar o progresso.');
    }

    const coursesData = await coursesResponse.json();
    const progressData = await progressResponse.json();
    courseCatalog = coursesData;
    courses = mergeCoursesWithProgress(courseCatalog, progressData);
    renderCourses(userId);
    showError(null);
  } catch (error) {
    console.error(error);
    showError(error.message || 'Erro inesperado ao carregar dados.');
  } finally {
    toggleLoading(false);
  }
}

function mergeCoursesWithProgress(coursesData, progressData) {
  const progressMap = new Map(progressData.map((item) => [item.courseId, item]));
  return coursesData.map((course) => {
    const progressCourse = progressMap.get(course.courseId) || {
      lessons: [],
      completedLessons: 0,
      totalLessons: course.lessons.length,
      progress: 0
    };

    const lessons = course.lessons.map((lesson) => {
      const progressLesson = progressCourse.lessons.find((l) => l.lessonId === lesson.lessonId);
      return {
        ...lesson,
        completed: progressLesson ? progressLesson.completed : false
      };
    });

    const completedLessons = lessons.filter((lesson) => lesson.completed).length;
    const totalLessons = lessons.length;
    const progress = totalLessons === 0 ? 0 : completedLessons / totalLessons;

    return {
      courseId: course.courseId,
      courseTitle: course.courseTitle,
      lessons,
      completedLessons,
      totalLessons,
      progress
    };
  });
}

function renderCourses(userId) {
  coursesContainer.innerHTML = '';

  courses.forEach((course) => {
    const template = courseTemplate.content.cloneNode(true);
    const title = template.querySelector('.course-title');
    const fill = template.querySelector('.progress-fill');
    const label = template.querySelector('.progress-label');
    const lessonsList = template.querySelector('.lessons');

    title.textContent = course.courseTitle;

    const percentage = Math.round(course.progress * 100);
    fill.style.width = `${percentage}%`;
    label.textContent = `${percentage}% (${course.completedLessons}/${course.totalLessons})`;

    course.lessons.forEach((lesson) => {
      const lessonItem = document.createElement('li');
      lessonItem.classList.add('lesson-item');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = lesson.completed;
      checkbox.addEventListener('change', () => {
        toggleLesson(userId, lesson.lessonId, checkbox.checked);
      });

      const label = document.createElement('label');
      label.textContent = lesson.lessonTitle;

      lessonItem.appendChild(checkbox);
      lessonItem.appendChild(label);
      lessonsList.appendChild(lessonItem);
    });

    coursesContainer.appendChild(template);
  });
}

async function toggleLesson(userId, lessonId, completed) {
  try {
    const response = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, lessonId, completed })
    });

    if (!response.ok) {
      throw new Error('Não foi possível atualizar o progresso.');
    }

    const data = await response.json();
    courses = mergeCoursesWithProgress(courseCatalog, data.progress);
    renderCourses(userId);
    showError(null);
  } catch (error) {
    console.error(error);
    showError(error.message || 'Erro ao atualizar progresso.');
    renderCourses(userId);
  }
}

function toggleLoading(isLoading) {
  reloadButton.disabled = isLoading;
  reloadButton.textContent = isLoading ? 'Carregando...' : 'Atualizar';
}

function showError(message) {
  if (!message) {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
    return;
  }

  errorMessage.classList.remove('hidden');
  errorMessage.textContent = message;
}

reloadButton.addEventListener('click', loadData);
userIdInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loadData();
  }
});

document.addEventListener('DOMContentLoaded', loadData);
