const { Cliente } = require('../../database/Cliente');
const { District } = require('../../database/District');
const { loaderFactory } = require('../../utils/loaderFactory');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');

module.exports = {
  Cliente: {
    provincia: async (parent, args, { loader }, info) => {
      if (parent.provincia !== undefined) {
        try {
          return await loaderFactory(loader, District, parent.provincia);
        } catch (error) {
          throw new Error('Error al cargar provincias');
        }
      }

      return null;
    }
  },
  Query: {
    obtenerClientes: async (_, __, ___, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;
      try {
        return await Cliente.find({}).select(fields).sort({ _id: -1 });
      } catch (error) {
        throw new Error('Cientes no existen');
      }
    },
    obtenerCliente: async (_, { id }) => {
      try {
        return await Cliente.findById(id);
      } catch (error) {
        throw new Error('Cliente no existe');
      }
    },
    getDistricts: async (_, __, ___, info) => {
      const fields = getMongooseSelectionFromReq(info);
      try {
        const res = await District.find().select(fields).sort({ _id: -1 });
        return res;
      } catch (error) {
        throw new Error('No se econtraron distritos');
      }
    }
  },
  Mutation: {
    nuevoCliente: async (_, { input }, __) => {
      const { cedula } = input;
      const cliente = await Cliente.findOne({ cedula });
      if (cliente) {
        throw new Error('Ese cliente ya esta registrado');
      }

      try {
        const nuevoCliente = new Cliente(input);
        nuevoCliente.id = nuevoCliente._id;
        await nuevoCliente.save();
        return nuevoCliente;
      } catch (error) {
        throw new Error('No se pudo registrar al cliente');
      }
    },
    actualizarCliente: async (_, { id, input }, __) => {
      let cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error('Ese cliente no existe');
      }

      try {
        return await Cliente.findOneAndUpdate({ _id: id }, input, {
          new: true
        });
      } catch (error) {
        throw new Error('No se pudo actualizar al cliente');
      }
    },
    eliminarCliente: async (_, { id }, __) => {
      let cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error('Ese cliente no existe');
      }

      try {
        await Cliente.findOneAndDelete({ _id: id });
        return 'Cliente Eliminado';
      } catch (error) {
        throw new Error('No se pudo eliminar al cliente');
      }
    }
  }
};
