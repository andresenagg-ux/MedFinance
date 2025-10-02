import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'medfinance.sqlite');

sqlite3.verbose();

export const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS Courses (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Lessons (
      id INTEGER PRIMARY KEY,
      courseId INTEGER NOT NULL,
      title TEXT NOT NULL,
      FOREIGN KEY(courseId) REFERENCES Courses(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      lessonId INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      UNIQUE(userId, lessonId),
      FOREIGN KEY(lessonId) REFERENCES Lessons(id) ON DELETE CASCADE
    )
  `);

  db.get('SELECT COUNT(*) as count FROM Courses', (err, row) => {
    if (err) {
      console.error('Failed to inspect Courses table', err);
      return;
    }

    if (row.count === 0) {
      seedInitialData();
    }
  });
});

function seedInitialData() {
  const courses = [
    { id: 1, title: 'Fundamentos de Finanças' },
    { id: 2, title: 'Planejamento Tributário' }
  ];

  const lessons = [
    { id: 1, courseId: 1, title: 'Introdução ao Orçamento' },
    { id: 2, courseId: 1, title: 'Gestão de Fluxo de Caixa' },
    { id: 3, courseId: 1, title: 'Metas Financeiras' },
    { id: 4, courseId: 2, title: 'Noções de Tributação' },
    { id: 5, courseId: 2, title: 'Impostos para Médicos' }
  ];

  db.serialize(() => {
    const insertCourse = db.prepare('INSERT INTO Courses (id, title) VALUES (?, ?)');
    courses.forEach((course) => insertCourse.run(course.id, course.title));
    insertCourse.finalize();

    const insertLesson = db.prepare('INSERT INTO Lessons (id, courseId, title) VALUES (?, ?, ?)');
    lessons.forEach((lesson) => insertLesson.run(lesson.id, lesson.courseId, lesson.title));
    insertLesson.finalize();

    console.log('Seeded initial courses and lessons');
  });
}

export function markLessonCompletion({ userId, lessonId, completed }) {
  return new Promise((resolve, reject) => {
    const status = completed ? 1 : 0;

    db.run(
      `INSERT INTO Progress (userId, lessonId, completed)
       VALUES (?, ?, ?)
       ON CONFLICT(userId, lessonId) DO UPDATE SET completed = excluded.completed`,
      [userId, lessonId, status],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      }
    );
  });
}

export function getProgressByUser(userId) {
  const sql = `
    SELECT
      c.id AS courseId,
      c.title AS courseTitle,
      l.id AS lessonId,
      l.title AS lessonTitle,
      COALESCE(p.completed, 0) AS completed
    FROM Courses c
    JOIN Lessons l ON l.courseId = c.id
    LEFT JOIN Progress p ON p.lessonId = l.id AND p.userId = ?
    ORDER BY c.id, l.id
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const coursesMap = new Map();

      rows.forEach((row) => {
        if (!coursesMap.has(row.courseId)) {
          coursesMap.set(row.courseId, {
            courseId: row.courseId,
            courseTitle: row.courseTitle,
            lessons: [],
            totalLessons: 0,
            completedLessons: 0,
            progress: 0
          });
        }

        const course = coursesMap.get(row.courseId);
        const lessonCompleted = Number(row.completed) === 1;

        course.lessons.push({
          lessonId: row.lessonId,
          lessonTitle: row.lessonTitle,
          completed: lessonCompleted
        });

        course.totalLessons += 1;
        if (lessonCompleted) {
          course.completedLessons += 1;
        }
        course.progress = course.totalLessons === 0 ? 0 : course.completedLessons / course.totalLessons;
      });

      resolve(Array.from(coursesMap.values()));
    });
  });
}

export function getCoursesWithLessons() {
  const sql = `
    SELECT c.id as courseId, c.title as courseTitle, l.id as lessonId, l.title as lessonTitle
    FROM Courses c
    JOIN Lessons l ON l.courseId = c.id
    ORDER BY c.id, l.id
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const coursesMap = new Map();
      rows.forEach((row) => {
        if (!coursesMap.has(row.courseId)) {
          coursesMap.set(row.courseId, {
            courseId: row.courseId,
            courseTitle: row.courseTitle,
            lessons: []
          });
        }
        coursesMap.get(row.courseId).lessons.push({
          lessonId: row.lessonId,
          lessonTitle: row.lessonTitle
        });
      });

      resolve(Array.from(coursesMap.values()));
    });
  });
}
