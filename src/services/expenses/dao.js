const { Expense } = require('./collection');
const { Provider } = require('../providers/collection');
const { Concept } = require('../concepts/collection');
const { Usuario } = require('../users/collection');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const { loaderFactory } = require('../../utils/loaderFactory');
const { getPaginateOptions } = require('../../config');
const { getPaginatedDocument } = require('../../utils/getPaginatedDocument');
const { multiple: multipleDTO } = require('./dto');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');

module.exports = {
  loaderProvider: async ({ parent, info, loader }) => {
    try {
      return await loaderFactory(loader, Provider, parent.proveedor);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  loaderConcept: async ({ parent, info, loader }) => {
    try {
      return await loaderFactory(loader, Concept, parent.concepto);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  loaderUser: async ({ parent, info, loader }) => {
    try {
      return await loaderFactory(loader, Usuario, parent.usuario);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  findAllExpenses: async ({ page, search }) => {
    const options = getPaginateOptions({
      page,
      sort: { _id: -1 },
    });
    const queryOptions = { dtoFn: multipleDTO, model: Expense, options };

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

  findOneExpense: async ({ id }) => {
    try {
      return await Expense.findById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  createExpense: async ({ input, current }) => {
    try {
      const expense = new Expense(input);
      expense.usuario = current.id;
      expense.id = expense._id;
      await expense.save();
      return expense;
    } catch (error) {
      throw new Error('Error! No se pudo crear');
    }
  },
  setExpense: async ({ id, input }) => {
    try {
      return await Expense.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
    } catch (error) {
      throw new Error('No se pudo actualizar');
    }
  },
  removeExpense: async ({ id }) => {
    try {
      await Expense.findOneAndDelete({ _id: id });
      return 'Eliminado';
    } catch (error) {
      throw new Error('No se pudo eliminar');
    }
  },
};
