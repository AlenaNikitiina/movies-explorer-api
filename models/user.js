const bcrypt = require('bcryptjs'); // импортируем модуль bcrypt
const mongoose = require('mongoose');
const validator = require('validator');

const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const { errorMessage } = require('../utils/constans');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 30,
  },
  email: {
    type: String,
    unique: true,
    require: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: errorMessage.INCORRECT_EMAIL_FORMAT,
    },
  },
  password: {
    type: String,
    require: true,
    select: false, // чтобы API не возвращал хеш пароля
  },
}, { versionKey: false });

// добавим метод findUserByCredentials схеме пользователя, будет два параметра

userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте. // this — это модель User
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // не нашёлся email— отклоняем промис
        return Promise.reject(new UnauthorizedError(errorMessage.INCORRECT_INPUT_DATA));
      }

      return bcrypt.compare(password, user.password) // нашёлся — сравниваем хеши
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(errorMessage.INCORRECT_INPUT_DATA)); // 401
          }

          return user; // теперь user доступен
        });
    });
};

// Чтобы найти пользователя по почте, нам потребуется метод findOne
// которому передадим на вход email. Метод findOne принадлежит модели User
// поэтому обратимся к нему через ключевое слово this: (не должна быть стрелочной

const User = mongoose.model('user', userSchema);

module.exports = User;
