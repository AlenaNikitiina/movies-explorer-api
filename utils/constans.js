const URL_CHECK = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// текст для ошибок в контроллерах
const errorMessage = {
  INCORRECT_MOVIE_DATA: 'Переданы некорректные данные при создании фильма.',
  INCORRECT_USER_DATA: 'Переданы некорректные данные при создании пользователя.',
  MOVIE_CONFLICT: 'Фильм с такими данными уже существует.',
  USER_CONFLICT: 'Пользователь с такими данными уже существует.',
  USER_NOT_FOUND: 'Пользователь не найден',
  ID_INCORRECT: 'Пользователь с некорректным id',
  INCORRECT_DATA: 'Переданы некорректные данные при обновлении профиля.',
  MOVIE_NOT_FOUND: 'Фильм с указанным _id не найден.',
  UNABLE_TO_DELETE: 'Невозможно удалить чужой фильм',
  NON_EXIST_PAGE: 'Несуществующая страница.',
};

module.exports = { URL_CHECK, errorMessage };
