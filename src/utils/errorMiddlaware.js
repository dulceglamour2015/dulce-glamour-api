const ERROR_HANDLER = {
  CastError: (res) => res.status(400).send({ error: 'id used is malformed' }),
  ValidationError: (res, { message }) =>
    res.status(409).send({ error: message }),
  JsonWebTokenError: (res) =>
    res.status(401).json({ error: 'Token is missed or invalid' }),
  defaultError: (res) => res.status(500).end()
};

module.exports = (error, request, response, next) => {
  const handler = ERROR_HANDLER[error.name] || ERROR_HANDLER.defaultError;

  handler(response, error);
};
