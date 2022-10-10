const dao = require('./dao');

module.exports = {
  Concept: {
    name: (parent) => {
      const { codigo, descripcion } = parent;

      return `${codigo} - ${descripcion}`;
    },
  },
  Query: {
    allConcepts: async (_, { page, search }) => {
      return await dao.findAllConcepts({ page, search });
    },

    getSelectConcepts: async (_, __, ___, info) => {
      return dao.getSelectConcepts({ info });
    },

    getConcept: async (_, { id }, __, info) => {
      return await dao.findOneConcept({ id });
    },
  },
  Mutation: {
    addConcept: async (_, { input }) => {
      return await dao.createConcept({ input });
    },
    updateConcept: async (_, { id, input }) => {
      return await dao.setConcept({ id, input });
    },
    deleteConcept: async (_, { id }) => {
      return await dao.removeConcept({ id });
    },
  },
};
