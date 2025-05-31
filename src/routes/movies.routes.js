
const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies.controller');

// This must point to an actual function!
router.get('/', moviesController.getAllMovies);
router.get('/:imdbId', moviesController.getMovieById);
router.get('/year/:year', moviesController.getMoviesByYear);
router.get('/genre/:genre', moviesController.getMoviesByGenre);


module.exports = router;
