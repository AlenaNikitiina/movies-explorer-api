// импортируем
require('dotenv').config(); // для переменные окружения

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const { errors } = require('celebrate'); // будет обрабатывать ток ошибки, которые сгенерировал celebrate
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/handleErrors');

// const { PORT, SERVER_ADDRESS } = require('./config');
const { PORT = 3000 } = process.env;
// const { SERVER_ADDRESS } = process.env;

const router = require('./routes/index'); // тут все роуты

// создаем приложение
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router); // Здесь роутинг всех

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(handleErrors); // централизованный обработчик ошибок

// подключаемся к серверу mongo
// mongoose.connect(SERVER_ADDRESS)

mongoose.connect('mongodb://127.0.0.1/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((error) => console.error('Ошибка подключения:', error));

//
app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
