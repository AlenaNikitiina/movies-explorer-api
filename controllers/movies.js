const mongoose = require('mongoose');
const Movies = require('../models/movie'); // модель

const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400
const OwnerError = require('../errors/OwnerError'); // 403
const { errorMessage } = require('../utils/constans');

// создаёт фильм.  POST /movies
const createMovie = (req, res, next) => {
  const owner = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(errorMessage.INCORRECT_MOVIE_DATA));
      } else {
        next(error);
      }
    });
};

// возвращает все сохранённые текущим пользователем фильмы.  GET /movies
const getMovies = (req, res, next) => {
  Movies.find({})
    .then((movies) => res.send(movies))
    .catch((error) => {
      next(error);
    });
};

// удаляет фильм по идентификатору.  DELETE /movies/:movieId
const deleteMovie = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(errorMessage.MOVIE_NOT_FOUND);
      }

      const ownerId = req.user._id;
      if (movie.owner.toString() === ownerId) {
        Movies.deleteOne(movie)
          .then(() => {
            res.status(200).send(movie);
          })
          .catch(next);
      } else {
        throw new OwnerError(errorMessage.UNABLE_TO_DELETE);
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError(errorMessage.MOVIE_NOT_FOUND));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
