// импортируем
require('dotenv').config(); // для переменные окружения

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const { errors } = require('celebrate'); // будет обрабатывать ток ошибки, которые сгенерировал celebrate
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/handleErrors');

const { port, urlMongo } = require('./config');

const { PORT = port, BD_ADDRESS = urlMongo } = process.env;

//
const router = require('./routes/index'); // тут все роуты

const app = express(); // создаем приложение

app.use(cors());
app.use(helmet());

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
// mongoose.connect(BD_ADDRESS, { useNewUrlParser: true }) // адрес сервера
// mongoose.connect('mongodb://127.0.0.1/bitfilmsdb')
mongoose.connect(BD_ADDRESS, { useNewUrlParser: true })
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((error) => console.error('Ошибка подключения:', error));

//
app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
