const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('express').Router(); // создали роутер
const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');
const { URL_CHECK } = require('../utils/isUrl');

// создаёт фильм
moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(URL_CHECK),
    trailerLink: Joi.string().required().regex(URL_CHECK),
    thumbnail: Joi.string().required().regex(URL_CHECK),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

// возвращает все фильмы
moviesRouter.get('/movies', getMovies);

// удаляет сохранённый фильм по id
moviesRouter.delete('/movie/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
