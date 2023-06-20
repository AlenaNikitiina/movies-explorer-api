const { OWNER_ERROR } = require('../utils/constans');

class OwnerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OwnerError';
    this.statusCode = OWNER_ERROR;
  }
}

module.exports = OwnerError;
