const express = require('express');
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);

app.use((err, req, res, next) => {
  // Capture generic errors
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
