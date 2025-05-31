
const db = require('../database/db');

exports.getMovies = (page = 1, limit = 50) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const query = `
      SELECT movieId, imdbId AS imdb_id, title, releaseDate, genres, '$' || budget AS budget
      FROM movies
      LIMIT ? OFFSET ?
    `;
    db.all(query, [limit, offset], (err, rows) => {
      if (err) {
        console.error('SQL Error:', err.message);
        reject(err);
      } else {
        const parsedRows = rows.map((movie) => {
          let parsedGenres = [];
          try {
            parsedGenres = JSON.parse(movie.genres);
          } catch (e) {
            console.warn(`Failed to parse genres for imdb_id=${movie.imdb_id}`);
          }
          return {
            ...movie,
            genres: parsedGenres
          };
        });
        resolve(parsedRows);
      }
    });
  });
};

exports.getMovieById = (movieId) => {
  return new Promise((resolve, reject) => {
        const query = `
          SELECT 
            m.imdbId AS imdb_id,
            m.title,
            m.releaseDate,
            m.genres,
            m.productionCompanies,
            m.overview AS description,
            m.language AS original_language,
            m.runtime,
            '$' || m.budget AS budget,
            ROUND(AVG(r.rating), 2) AS averageRating
          FROM movies m
          LEFT JOIN ratings r ON m.movieId = r.movieId
          WHERE m.movieId = ?
          GROUP BY m.movieId
        `;
    db.get(query, [movieId], (err, row) => {
      if (err) {
        console.error('SQL Error:', err.message);
        reject(err);
      } else {
        if (row) {
          try {
            row.genres = JSON.parse(row.genres);
          } catch (e) {
            console.warn(`Failed to parse genres for imdb_id=${movieId}`);
            row.genres = [];
          }
        }
        resolve(row);
      }
    });
  });
};


exports.getMoviesByYear = (year, page = 1, sort = 'asc', limit = 50) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const sortOrder = sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const query = `
      SELECT imdbId AS imdb_id, title, releaseDate, genres, '$' || budget AS budget
      FROM movies
      WHERE strftime('%Y', releaseDate) = ?
      ORDER BY releaseDate ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    db.all(query, [year, limit, offset], (err, rows) => {
      if (err) {
        console.error('SQL Error:', err.message);
        reject(err);
      } else {
        const parsedRows = rows.map((movie) => {
          let parsedGenres = [];
          try {
            parsedGenres = JSON.parse(movie.genres);
          } catch {
            parsedGenres = [];
          }
          return { ...movie, genres: parsedGenres };
        });
        resolve(parsedRows);
      }
    });
  });
};

exports.getMoviesByGenre = (genre, page = 1, limit = 50) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    const query = `
      SELECT imdbId AS imdb_id, title, releaseDate, genres, '$' || budget AS budget
      FROM movies
      WHERE genres LIKE ?
      LIMIT ? OFFSET ?
    `;

    const likePattern = `%${genre}%`;

    db.all(query, [likePattern, limit, offset], (err, rows) => {
      if (err) {
        console.error('SQL Error:', err.message);
        reject(err);
      } else {
        const parsedRows = rows.map((movie) => {
          let parsedGenres = [];
          try {
            parsedGenres = JSON.parse(movie.genres);
          } catch {
            parsedGenres = [];
          }
          return { ...movie, genres: parsedGenres };
        });
        resolve(parsedRows);
      }
    });
  });
};
