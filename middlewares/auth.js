const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const { errorMessage } = require('../utils/constans'); // 401

// Если предоставлен верный токен, запрос проходит на дальнейшую обработку.
// Иначе запрос переходит контроллеру, кот возвр клиенту сообщение об ошибке.

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(errorMessage.NEED_AUTHORIZATION)); // no
  }

  // Если токен на месте,Извлечём его. вызовем м replace, чтоб выкинуть из заголовка приставкуBearer
  const token = authorization.replace('Bearer ', ''); // Таким образом, в переменную token запишется только JWT.
  let payload;

  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // получилось
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError(errorMessage.NEED_AUTHORIZATION));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
