const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');
const schemaDirectives = require('./graphql/directives');
const { APOLLO_OPTIONS } = require('./config');
const { authContext } = require('./utils/auth');
const Single = require('./utils/loaderSingle');

// Apollo
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives
});

module.exports.apolloServer = new ApolloServer({
  ...APOLLO_OPTIONS,
  introspection: true,
  schema,
  context: async ({ req, res }) => {
    const loader = {
      single: new Single()
    };
    let current = null;
    const authorization = req.headers['authorization'];
    if (authorization) {
      current = await authContext(authorization);
    }

    return { req, res, current, loader };
  }
});
