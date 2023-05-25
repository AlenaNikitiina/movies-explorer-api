const mongoose = require('mongoose');
const Movies = require('../models/movie'); // модель

const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400
const OwnerError = require('../errors/OwnerError'); // 403
const { errorMessage } = require('../utils/constans');

// создаёт фильм.  POST /movies
const createMovie = (req, res, next) => {
  // console.log('11', req.body);
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

// недоделано ?????????????????
// удаляет фильм по идентификатору.  DELETE /cards/:cardId  DELETE /movies/:movieId
const deleteMovie = (req, res, next) => {
  // console.log('12', req.params.movieId, req.user);
  Movies.findById(req.params._id)
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
        // next(new BadRequestError('Фильм с указанным _id не найдена.'));
        next(new BadRequestError(errorMessage.MOVIE_NOT_FOUND));
      } else {
        next(error);
      }
    });
};

/* // удаляет карточку по идентификатору.  DELETE /cards/:cardId
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }

      const ownerId = req.user._id;
      if (card.owner.toString() === ownerId) {
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ data: card });
          })
          .catch(next);
      } else {
        throw new OwnerError('Удаление чужой карточки невозможно');
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
      // if (error.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным _id не найдена.'));
      } else {
        next(error);
      }
    });
};
*/

module.exports = {
  getMovies, createMovie, deleteMovie,
};
