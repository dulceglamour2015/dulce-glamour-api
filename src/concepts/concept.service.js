const { Concept } = require('./concept.model');
const { getMongooseSelectionFromReq } = require('../utils/selectFields');

module.exports = {
  findAllConcepts: async ({ info }) => {
    const fields = getMongooseSelectionFromReq(info);
    try {
      return await Concept.find().select(fields).sort({ _id: 1 });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  findOneConcept: async ({ id }) => {
    try {
      return await Concept.findById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  createConcept: async ({ input }) => {
    const existConcept = await Concept.findOne({ codigo: input.codigo });
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
  setConcept: async ({ id, input }) => {
    try {
      return await Concept.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
    } catch (error) {
      throw new Error('No se pudo actualizar');
    }
  },
  removeConcept: async ({ id }) => {
    try {
      await Concept.findOneAndDelete({ _id: id });
      return 'Concepto Eliminado';
    } catch (error) {
      throw new Error('No se pudo eliminar');
    }
  },
};
