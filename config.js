const { PORT = 3000 } = process.env;
const { BD_ADDRESS = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;

module.exports = {
  PORT, BD_ADDRESS,
};
