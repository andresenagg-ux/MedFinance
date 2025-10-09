const {
  initializeDatabase,
  resetDatabase,
  closeDatabase,
} = require('../src/db');

beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});
