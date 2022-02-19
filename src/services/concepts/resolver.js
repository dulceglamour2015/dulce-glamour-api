const {
  findAllConcepts,
  findOneConcept,
  createConcept,
  setConcept,
  removeConcept,
} = require('./concept.service');

module.exports = {
  Query: {
    allConcepts: async (_, __, ___, info) => {
      return await findAllConcepts({ info });
    },

    getConcept: async (_, { id }, __, info) => {
      return await findOneConcept({ id });
    },
  },
  Mutation: {
    addConcept: async (_, { input }) => {
      return await createConcept({ input });
    },
    updateConcept: async (_, { id, input }) => {
      return await setConcept({ id, input });
    },
    deleteConcept: async (_, { id }) => {
      return await removeConcept({ id });
    },
  },
};
