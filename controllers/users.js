const bcrypt = require('bcryptjs'); // импортируем модуль bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const mongoose = require('mongoose');

const User = require('../models/user'); // модель
const BadRequestError = require('../errors/BadRequestError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409
const { errorMessage } = require('../utils/constans');

const { NODE_ENV, JWT_SECRET } = process.env;

// создаёт пользователя с переданными в теле email, password и name  POST /signup
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash, // записываем хеш в базу. преобразование данных в строку
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(errorMessage.INCORRECT_USER_DATA));
      } else if (error.code === 11000 && error.name === 'MongoServerError') {
        next(new ConflictError(errorMessage.USER_CONFLICT));
      } else {
        next(error);
      }
    });
};

// возвращает информацию о пользователе (email и имя).  GET /users/me
const getCurrentUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(errorMessage.USER_NOT_FOUND);
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// обновляет информацию о пользователе (email и имя).  PATCH /users/me
const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(errorMessage.ID_INCORRECT);
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(errorMessage.INCORRECT_DATA));
      } else {
        next(error);
      }
    });
};

// проверяет переданные в теле почту и пароль и если совпадает в бд возвр JWT.  POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }); // создадим токен
      res.send({ token }); // аутентификация успешна
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  createUser, updateUser, login, getCurrentUserMe,
};
