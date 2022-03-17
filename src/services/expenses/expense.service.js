const { Expense } = require('./expense.model');
const { Provider } = require('../providers/collection');
const { Concept } = require('../concepts/collection');
const { Usuario } = require('../users/collection');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const { loaderFactory } = require('../../utils/loaderFactory');

module.exports = {
  loaderProvider: async ({ parent, info, loader }) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;

    try {
      return await loaderFactory(loader, Provider, parent.proveedor);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  loaderConcept: async ({ parent, info, loader }) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;

    try {
      return await loaderFactory(loader, Concept, parent.concepto);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  loaderUser: async ({ parent, info, loader }) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;

    try {
      return await loaderFactory(loader, Usuario, parent.usuario);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  findAllExpenses: async ({ info }) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;
    try {
      return await Expense.find().select(fields).sort({ _id: -1 });
    } catch (error) {
      throw new Error(error.message);
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