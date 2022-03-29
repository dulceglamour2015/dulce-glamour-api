const { PaginationParameters } = require('mongoose-paginate-v2');

const getPaginationParams = (req) => {
  return new PaginationParameters(req).get();
};

module.exports = getPaginationParams;
