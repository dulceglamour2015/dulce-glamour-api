const { getPaginateOptions } = require('../../config');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const { Cliente } = require('../clients/collection');
const { District } = require('../clients/district-collection');
const { EOrder } = require('./collection');
const {
  checkProductsStockFromEOrders,
  discountProductsFromEOrder,
  restoreStockProductsFromEOrder,
  getPaginatedEOrders,
} = require('./utils');

module.exports = {
  Query: {
    getEOrders: async (_, { status, page, search }) => {
      let query = {};
      if (status) {
        query.status = status;
      }
      const options = getPaginateOptions({
        page,
        limit: 10,
        sort: { _id: -1 },
      });

      try {
        if (search) {
          const searchOptions = getPaginateOptions({
            page,
            limit: 10,
            sort: { score: { $meta: 'textScore' } },
            projection: { score: { $meta: 'textScore' } },
          });

          const searchOrders = await getPaginatedEOrders({
            query: { $text: { $search: search } },
            options: searchOptions,
          });

          return searchOrders;
        }

        const paginateOrders = await getPaginatedEOrders({ query, options });

        return paginateOrders;
      } catch (error) {
        handleErrorResponse({ errorMsg: error });
      }
    },

    getEOrder: async (_, { id }) => {
      try {
        return await EOrder.findById(id);
      } catch (error) {
        handleErrorResponse({ errorMsg: error });
      }
    },
  },
  Mutation: {
    addEOrder: async (_, { input }) => {
      const { client, shipping } = input;
      // await checkProductsStockFromEOrders(input.lineProducts);
      // await discountProductsFromEOrder(input.lineProducts);
      try {
        const provinceName = shipping.city + ' - ' + shipping.province;
        let clientID;
        const dbClient = await Cliente.findOne({ cedula: input.client.dni });
        const dbProvince = await District.findOne({ nombre: provinceName });

        if (!dbClient) {
          const clientData = {
            cedula: client.dni,
            nombre: client.fullName,
            mail: client.email,
            telefono: client.phone,
            provincia: dbProvince._id,
            direccion: shipping.address,
          };

          const newClient = await Cliente.create(clientData);
          clientID = newClient._id;
        } else {
          clientID = dbClient._id;
        }

        const eorder = new EOrder({ clientID, status: 'PENDING', ...input });
        await eorder.save();

        return { id: eorder._doc._id, ...eorder._doc };
      } catch (error) {
        handleErrorResponse({ errorMsg: error });
      }
    },

    updateEOrder: async (_, { id, input }) => {
      const dbEOrder = await EOrder.findById(id);

      if (!dbEOrder) return;

      try {
        // await checkProductsStockFromEOrders(input.lineProducts);

        // await restoreStockProductsFromEOrder(dbEOrder.prevEOrder);

        // await discountProductsFromEOrder(input.lineProducts);

        return await EOrder.findByIdAndUpdate(id, input, { new: true });
      } catch (error) {
        handleErrorResponse({ errorMsg: error });
      }
    },

    updateEOrderStatus: async (_, { id, status }) => {
      try {
        return await EOrder.findByIdAndUpdate(id, { status }, { new: true });
      } catch (error) {
        console.error(error);
        throw new Error('No se pudo actualizar el estado del pedido.');
      }
    },

    deleteEOrder: async (_, { id }, { current }) => {
      const dbEOrder = await EOrder.findById(id);

      if (!dbEOrder) return;

      try {
        // if (dbEOrder.lineProducts.length > 0)
        //   await restoreStockProductsFromEOrder(dbEOrder.lineProducts);

        if (dbEOrder.status === 'PENDING') {
          await EOrder.findByIdAndDelete(id);
        } else {
          await EOrder.deleteById(id, current.id);
        }

        return 'Pedido Eliminado';
      } catch (error) {
        handleErrorResponse({ errorMsg });
      }
    },
  },
};
