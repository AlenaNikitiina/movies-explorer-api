const bcrypt = require('bcryptjs'); // импортируем модуль bcrypt
const mongoose = require('mongoose');
const validator = require('validator');

const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'ТNinj',
    minLength: [2, 'Минимальная длина поля "name" - 2'],
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
      message: 'Неправильный формат почты',
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
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль')); // не нашёлся email— отклоняем промис
      }

      return bcrypt.compare(password, user.password) // нашёлся — сравниваем хеши
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль')); // 401
          }

          return user; // теперь user доступен
        });
    });
};

// Чтобы найти пользователя по почте, нам потребуется метод findOne
// которому передадим на вход email. Метод findOne принадлежит модели User
// поэтому обратимся к нему через ключевое слово this: (не должна быть стрелочной

// module.exports = mongoose.model('User', userSchema); или так
// const User = mongoose.model('User', userSchema); перестало работать
const User = mongoose.model('user', userSchema);

module.exports = User;
