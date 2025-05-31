
const movieService = require('../services/movies.service');

const getAllMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  try {
    const movies = await movieService.getMovies(page);
    res.json({ page, data: movies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

const getMovieById = async (req, res) => {
  const imdbId = req.params.imdbId;

  try {
    const movie = await movieService.getMovieById(imdbId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
};

const getMoviesByYear = async (req, res) => {
  const year = req.params.year;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || 'asc';

  try {
    const movies = await movieService.getMoviesByYear(year, page, sort);
    res.json({ year, page, sort, data: movies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movies by year' });
  }
};

const getMoviesByGenre = async (req, res) => {
  const genre = req.params.genre;
  const page = parseInt(req.query.page) || 1;

  try {
    const movies = await movieService.getMoviesByGenre(genre, page);
    res.json({ genre, page, data: movies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movies by genre' });
  }
};


module.exports = {
  getAllMovies,
  getMovieById,
  getMoviesByYear,
  getMoviesByGenre
};
