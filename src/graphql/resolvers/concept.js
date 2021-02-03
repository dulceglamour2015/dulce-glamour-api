const { Concept } = require('../../database/Concept');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');

module.exports = {
  Query: {
    allConcepts: async (_, __, ___, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;
      try {
        return await Concept.find().select(fields).sort({ _id: -1 });
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getConcept: async (_, { id }, __, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;
      try {
        return await Concept.findById(id).select(fields);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    addConcept: async (_, { input }) => {
      const existConcept = await Concept.findOne({ nombre: input.nombre });
      if (existConcept) throw new Error('Error! el concepto ya existe');

      try {
        const concept = new Concept(input);
        concept.id = concept._id;
        await concept.save();
        return concept;
      } catch (error) {
        throw new Error('Error! No se pudo crear');
      }
    },
    updateConcept: async (_, { id, input }) => {
      try {
        return await Concept.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
      } catch (error) {
        throw new Error('No se pudo actualizar');
      }
    },
    deleteConcept: async (_, { id }) => {
      try {
        await Concept.findOneAndDelete({ _id: id });
        return 'Concepto Eliminado';
      } catch (error) {
        throw new Error('No se pudo eliminar');
      }
    },
  },
};
