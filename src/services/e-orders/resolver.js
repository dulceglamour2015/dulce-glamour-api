const { isEqual } = require('lodash');
const { getPaginateOptions } = require('../../config');
const { formatPrice } = require('../../utils/formatPrice');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const { Cliente } = require('../clients/collection');
const { District } = require('../clients/district-collection');
const { EOrder } = require('./collection');
const dto = require('./dto');
const {
  checkProductsStockFromEOrders,
  discountProductsFromEOrder,
  restoreStockProductsFromEOrder,
  getPaginatedEOrders,
  hanleUpdateEOrder,
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
        const eorder = await EOrder.findById(id);
        return dto.single(eorder);
      } catch (error) {
        handleErrorResponse({ errorMsg: error });
      }
    },
  },
  Mutation: {
    addEOrder: async (_, { input }) => {
      let clientID;
      const { client, shipping } = input;
      const provinceName = shipping.city + ' - ' + shipping.province;

      try {
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

        const eorder = new EOrder({
          clientID,
          status: 'PENDING',
          ...input,
        });

        await eorder.save();

        return dto.single(eorder);
      } catch (error) {
        handleErrorResponse({ errorMsg: error });
      }
    },

    updateEOrder: async (_, { id, input }, { current }) => {
      const { lineProducts, client, ...restOfInput } = input;
      try {
        const dbEOrder = await EOrder.findById(id);

        const dbLineProducts = dbEOrder.lineProducts.map((product) => ({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          image: product.image,
        }));
        const updateInput = {
          client: { ...dbEOrder.client, ...client },
          updateUser: current.id,
          ...restOfInput,
        };
        const isSameProductsNQtities = isEqual(dbLineProducts, lineProducts);

        if (isSameProductsNQtities) {
          return await hanleUpdateEOrder(id, updateInput);
        }

        if (!isSameProductsNQtities) {
          const deleteProductsToRestore = dbLineProducts.filter((dbProduct) => {
            return !lineProducts.some((inputProduct) => {
              return dbProduct.id === inputProduct.id;
            });
          });

          const newProductsArr = lineProducts.filter((inputProduct) => {
            return !dbLineProducts.some((storeProduct) => {
              return inputProduct.id === storeProduct.id;
            });
          });

          const storeProductsUpdQtity = lineProducts.filter((inputProduct) => {
            return dbLineProducts.some((storeProduct) => {
              return (
                inputProduct.id === storeProduct.id &&
                inputProduct.quantity !== storeProduct.quantity
              );
            });
          });

          if (newProductsArr.length > 0) {
            await checkProductsStockFromEOrders(newProductsArr);
            await discountProductsFromEOrder(newProductsArr);
          }

          if (deleteProductsToRestore.length > 0) {
            await restoreStockProductsFromEOrder(deleteProductsToRestore);
          }

          if (storeProductsUpdQtity.length > 0) {
            const dbProductsUpdQtity = dbLineProducts.filter((dbProduct) => {
              return storeProductsUpdQtity.some((storeProduct) => {
                return dbProduct.id === storeProduct.id;
              });
            });

            await restoreStockProductsFromEOrder(dbProductsUpdQtity);
            const checkStock = await checkProductsStockFromEOrders(
              storeProductsUpdQtity
            );

            if (checkStock) {
              await discountProductsFromEOrder(storeProductsUpdQtity);
            } else {
              await discountProductsFromEOrder(dbProductsUpdQtity);
              handleErrorResponse({
                errorMsg: 'Error algo ha salido mal con el chekeo del stock',
                message:
                  'No se ha podido descontar del stock porfavor intenta de nuevo o revisa el stock.',
              });
            }
          }

          return await hanleUpdateEOrder(id, {
            ...updateInput,
            lineProducts,
          });
        }
      } catch (error) {
        handleErrorResponse({ errorMsg: error });
      }
    },

    updateEOrderPaid: async (_, { input }, { current }) => {
      const { order: orderId, ...restInput } = input;

      try {
        return await EOrder.findByIdAndUpdate(
          orderId,
          {
            ...restInput,
            status: 'PAID',
            paidUser: current.id,
            paidAt: Date.now(),
          },
          { new: true }
        );
      } catch (error) {
        handleErrorResponse({ errorMsg: error });
      }
    },

    deleteEOrder: async (_, { id }, { current }) => {
      try {
        const dbEOrder = await EOrder.findById(id);

        if (dbEOrder.status === 'PAGADO') {
          if (dbEOrder.lineProducts.length > 0)
            await restoreStockProductsFromEOrder(dbEOrder.lineProducts);
        }

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
