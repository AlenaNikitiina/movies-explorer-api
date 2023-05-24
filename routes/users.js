// это файл маршрутa user, сюда приходят запросы от пользователей
const usersRouter = require('express').Router(); // создали роутер

const { updateUser, getCurrentUserMe } = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/routesValidation');

// роут возвращает инфу о текущем пользователе
usersRouter.get('/users/me', getCurrentUserMe);

/* dont need
// возвращает пользователя по _id
usersRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser); */

// роут обновляет профиль
usersRouter.patch('/users/me', updateUserValidator, updateUser);

module.exports = usersRouter;

/*
// это файл маршрутa user, сюда приходят запросы от пользователей
const usersRouter = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
// const { URL_CHECK } = require('../utils/isUrl');

const {
  getUser, getUsers, updateUser, getCurrentUserMe,
} = require('../controllers/users');

// это ф контроллеры она идет в базу данных и возвр челу результат
usersRouter.get('/users', getUsers); // возвр всех пользователей.
usersRouter.get('/users/me', getCurrentUserMe); // роут возвращает инфу о текущем пользователе

// возвращает пользователя по _id
usersRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);

// обновляет профиль
usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

module.exports = usersRouter;
*/
