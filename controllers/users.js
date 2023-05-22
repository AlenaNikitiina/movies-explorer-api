const bcrypt = require('bcryptjs'); // импортируем модуль bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const mongoose = require('mongoose');

const User = require('../models/user'); // модель
const BadRequestError = require('../errors/BadRequestError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

const { NODE_ENV, JWT_SECRET } = process.env;

// создаёт пользователя.  POST('/users', createUser)
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
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (error.code === 11000 && error.name === 'MongoServerError') {
        next(new ConflictError('Пользователь с такими данными уже существует.'));
      } else {
        next(error);
      }
    });
};

// возвращает текущего пользователя    GET('users/me')
const getCurrentUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// возвращает пользователя по _id.  GET('/users/:id', getUser)
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new NotFoundError('Пользователь с некорректным id');
      return error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Пользователь по указанному _id не найден.'));
      } else {
        next(error);
      }
    });
};

// возвращает всех пользователей.  GET('/users', getUsers)
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// обновляет профиль (имя,о себе)  PATCH /users/me
const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с некорректным id');
    })
    .then((users) => res.send(users))
    .catch((error) => {
      // console.log("name error:", error.name, ", code:", error.statusCode);
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(error);
      }
    });
};

// Создаём контроллер аутентификации
// Если почта и пароль совпадают с теми, что есть в базе, чел входит на сайт
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

//
module.exports = {
  createUser, getUser, getUsers, updateUser, login, getCurrentUserMe,
};
