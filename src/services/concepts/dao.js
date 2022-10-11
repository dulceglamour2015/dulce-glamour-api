const { Concept } = require('./collection');
const { multiple } = require('./dto');
const getPaginateOptions = require('../../config/paginationsOptions');
const { getPaginatedDocument } = require('../../utils/getPaginatedDocument');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');

module.exports = {
  findAllConcepts: async ({ page, search }) => {
    const options = getPaginateOptions({
      page,
      sort: { _id: -1 },
    });
    const queryOptions = { dtoFn: multiple, model: Concept, options };

    if (search) {
      const searchOptions = getPaginateOptions({
        ...options,
        sort: { score: { $meta: 'textScore' } },
        projection: { score: { $meta: 'textScore' } },
      });
      const query = { $text: { $search: search } };

      queryOptions.options = searchOptions;
      queryOptions.query = query;
    }

    try {
      const { docs, pageInfo } = await getPaginatedDocument(queryOptions);

      return { docs, pageInfo };
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  getSelectConcepts: async ({ info }) => {
    const select = getMongooseSelectionFromReq(info);

    try {
      const concepts = await Concept.find()
        .select(select)
        .sort({ _id: -1 })
        .lean();
      const mapConcepts = multiple(concepts);

      return mapConcepts;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
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
      handleErrorResponse({ errorMsg: error });
    }
  },
  removeConcept: async ({ id, userId }) => {
    try {
      await Concept.deleteById(id, userId);
      return 'Concepto Eliminado';
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
};
