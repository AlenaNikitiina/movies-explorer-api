const router = require('express').Router(); // создали роутер
const usersRouter = require('./users');
const moviesRouter = require('./movies');

const { createUser, login } = require('../controllers/users');
const { siginValidator, sigupValidator } = require('../middlewares/routesValidation');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError'); // 404

// // Здесь роутинг :

// роут для логина
router.post('/signin', siginValidator, login);

// роут для регистрации
router.post('/signup', sigupValidator, createUser);

router.use(auth); // ниже все будут защищены авторизацией

router.use('/', usersRouter); // запускаем. передали ф своим обработчикам запроса
router.use('/', moviesRouter);
// неизвестного маршрута
router.use('*', (req, res, next) => {
  next(new NotFoundError('Несуществующая страница.'));
});

module.exports = router;
