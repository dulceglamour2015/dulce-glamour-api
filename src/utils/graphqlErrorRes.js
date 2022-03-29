const { ApolloError } = require('apollo-server-errors');

function handleErrorResponse({
  message = 'Algo salío mal',
  errorMsg,
  code = 401,
}) {
  console.error(errorMsg);
  throw new ApolloError(message, code);
}

module.exports = {
  404: new ApolloError('Cannot get resource', '404'),
  400: new ApolloError('Bad Request', '400'),
  notResources: new ApolloError('Lo sentimos no se encontraron los recursos'),
  custom: (message) => new ApolloError(message),
  handleErrorResponse,
};
