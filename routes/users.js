// это файл маршрутa user, сюда приходят запросы от пользователей
const usersRouter = require('express').Router(); // создали роутер

const { updateUser, getCurrentUserMe } = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/routesValidation');

// роут возвращает инфу о текущем пользователе
usersRouter.get('/users/me', getCurrentUserMe);

// роут обновляет профиль
usersRouter.patch('/users/me', updateUserValidator, updateUser);

module.exports = usersRouter;
