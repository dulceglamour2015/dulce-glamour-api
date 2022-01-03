const { Cliente } = require('./collection');
const { District } = require('./district.model');
const { findAllOrders } = require('../orders/orders.lib');
const { loaderFactory } = require('../utils/loaderFactory');
const { getMongooseSelectionFromReq } = require('../utils/selectFields');

module.exports = {
  loaderDistricts: async ({ loader, provincia }) => {
    if (provincia !== undefined) {
      try {
        return await loaderFactory(loader, District, provincia);
      } catch (error) {
        throw new Error('Error al cargar provincias');
      }
    }

    return null;
  },

  getClients: async ({ info }) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;
    try {
      return await Cliente.find({}).select(fields).sort({ nombre: 1 });
    } catch (error) {
      throw new Error('Error! No se pudieron cargar clientes!');
    }
  },
  getClient: async ({ id }) => {
    try {
      return await Cliente.findById(id);
    } catch (error) {
      throw new Error('Cliente no existe');
    }
  },
  allDistricts: async ({ info }) => {
    const fields = getMongooseSelectionFromReq(info);
    try {
      const res = await District.find().select(fields).sort({ _id: -1 });
      return res;
    } catch (error) {
      throw new Error('No se econtraron distritos');
    }
  },
  lastOrders: async ({ info, id }) => {
    const fields = getMongooseSelectionFromReq(info);
    try {
      return await findAllOrders(
        { estado: 'PAGADO', cliente: id },
        { fields, limit: 40 }
      );
    } catch (error) {
      throw new Error('No se encontraron pedidos!');
    }
  },

  addClient: async ({ input }) => {
    const { cedula, nombre } = input;
    const existCed = await Cliente.findOne({ cedula });
    const existName = await Cliente.findOne({ nombre });
    if (existCed || existName) {
      throw new Error('El cliente ya esta registrado');
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
  updateClient: async ({ id, input }) => {
    if (input.nombre) {
      const exist = await Cliente.findOne({ nombre: input.nombre });
      if (exist) throw new Error('El cliente ya existe!');
    }

    try {
      return await Cliente.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
    } catch (error) {
      throw new Error('No se pudo actualizar al cliente');
    }
  },
  deleteClient: async ({ id }) => {
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
  },
};
