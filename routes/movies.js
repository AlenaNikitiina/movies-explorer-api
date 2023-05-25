const moviesRouter = require('express').Router(); // создали роутер
const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');
const { createMovieValidator, deleteMovieValidator } = require('../middlewares/routesValidation');

// создаёт фильм
moviesRouter.post('/movies', createMovieValidator, createMovie);

// возвращает все фильмы
moviesRouter.get('/movies', getMovies);

// удаляет сохранённый фильм по id
moviesRouter.delete('/movies/:movieId', deleteMovieValidator, deleteMovie);

module.exports = moviesRouter;
