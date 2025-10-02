import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, '../../data/courses.json');

async function readCourses() {
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

async function writeCourses(courses) {
  await fs.writeFile(DATA_PATH, JSON.stringify(courses, null, 2));
}

export async function getCourseById(id) {
  const courses = await readCourses();
  return courses.find((course) => course.id === String(id)) ?? null;
}

export async function saveCourseVideoUrl(id, { videoUrl, vimeoResourceUri }) {
  const courses = await readCourses();
  const index = courses.findIndex((course) => course.id === String(id));

  if (index === -1) {
    throw new Error(`Curso ${id} não encontrado`);
  }

  const updatedCourse = {
    ...courses[index],
    videoUrl,
    vimeoResourceUri,
  };

  courses[index] = updatedCourse;
  await writeCourses(courses);

  return updatedCourse;
}
