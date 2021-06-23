const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const schemaDirectives = require('./directives');

// Apollo Schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives,
});

module.exports = { schema };
