const { Expense } = require('../../database/Expenses');
const { Provider } = require('../../database/Provider');
const { Concept } = require('../../database/Concept');
const { Usuario } = require('../../database/Usuario');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');

module.exports = {
  Expense: {
    proveedor: async (parent, _args, _ctx, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      try {
        return await Provider.findById(parent.proveedor);
      } catch (error) {
        throw new Error(error.message);
      }
    },

    concepto: async (parent, _args, _ctx, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      try {
        return await Concept.findById(parent.concepto);
      } catch (error) {
        throw new Error(error.message);
      }
    },

    usuario: async (parent, _args, _ctx, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      try {
        return await Usuario.findById(parent.usuario);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Query: {
    allExpenses: async (_, __, ___, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;
      try {
        return await Expense.find().select(fields).sort({ _id: -1 });
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getExpense: async (_, { id }, __, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;
      try {
        return await Expense.findById(id).select(fields);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    addExpense: async (_, { input }, { current }) => {
      const existExpense = await Expense.findOne({ nombre: input.nombre });
      if (existExpense) throw new Error('Error! ya existe');

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
    updateExpense: async (_, { id, input }) => {
      try {
        return await Expense.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
      } catch (error) {
        throw new Error('No se pudo actualizar');
      }
    },
    deleteExpense: async (_, { id }) => {
      try {
        await Expense.findOneAndDelete({ _id: id });
        return 'Eliminado';
      } catch (error) {
        throw new Error('No se pudo eliminar');
      }
    },
  },
};
