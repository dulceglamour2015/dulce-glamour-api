const { ApolloServer } = require('apollo-server-express');
const { MongooseDataloaderFactory } = require('graphql-dataloader-mongoose');
const { APOLLO_OPTIONS } = require('./config');
const { schema } = require('./graphql/schema');
const { authContext } = require('./utils/auth');
const { pluginSentry } = require('./utils/sentry');

module.exports.apolloServer = new ApolloServer({
  ...APOLLO_OPTIONS,
  uploads: false,
  schema,
  plugins: [pluginSentry],

  context: async ({ req, res }) => {
    throw new Error();
    const loader = new MongooseDataloaderFactory();
    let current = null;

    const authorization = req.headers['authorization'];
    if (authorization) {
      current = await authContext(authorization);
    }
    return { req, res, current, loader };
  },
});
