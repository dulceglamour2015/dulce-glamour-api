const logger = require('./logger');
const { pluginSentry } = require('./sentry');
const { IN_PROD } = require('../config');
function getApolloPlugins() {
  const plugins = [pluginSentry];

  if (IN_PROD) {
    plugins.push(logger);
  }

  return plugins;
}

module.exports = { getApolloPlugins };
