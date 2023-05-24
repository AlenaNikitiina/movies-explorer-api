const mongoose = require('mongoose');
const Movies = require('../models/movie'); // модель

const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400
const OwnerError = require('../errors/OwnerError'); // 403

// создаёт фильм.  POST /movies
const createMovie = (req, res, next) => {
  console.log('1 createMovie: start:', req.user._id);
  const owner = req.user._id;
  console.log('2 createMovie: owner=', owner);

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
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(error);
      }
    });
};

// недоделано
// возвращает все сохранённые текущим пользователем фильмы.  GET /movies
const getMovies = (req, res, next) => {
  Movies.find({})
    .then((movies) => res.send(movies))
    .catch((error) => {
      next(error);
    });
};

// недоделано
// удаляет фильм по идентификатору.  DELETE /cards/:cardId  DELETE /movies/:movieId
const deleteMovie = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      }

      const ownerId = req.user._id;
      if (movie.owner.toString() === ownerId) {
        Movies.deleteOne(movie)
          .then(() => {
            res.status(200).send({ data: movie });
          })
          .catch(next);
      } else {
        throw new OwnerError('Удаление чужой карточки невозможно');
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Фильм с указанным _id не найдена.'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
