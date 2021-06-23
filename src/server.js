const { ApolloServer } = require('apollo-server-express');
const { MongooseDataloaderFactory } = require('graphql-dataloader-mongoose');
const { APOLLO_OPTIONS } = require('./config');
const { schema } = require('./graphql/schema');
const { authContext } = require('./utils/auth');

module.exports.apolloServer = new ApolloServer({
  ...APOLLO_OPTIONS,
  introspection: true,
  uploads: false,
  schema,
  context: async ({ req, res }) => {
    let current = null;
    const loader = new MongooseDataloaderFactory();

    const authorization = req.headers['authorization'];
    if (authorization) {
      current = await authContext(authorization);
    }

    return { req, res, current, loader };
  },
});
