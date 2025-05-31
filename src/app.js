

const express = require('express');
const app = express();
const moviesRoutes = require('./routes/movies.routes');


app.use(express.json());


app.use('/api/movies', moviesRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
