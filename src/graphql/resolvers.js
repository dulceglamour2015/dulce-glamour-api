const { mergeResolvers } = require('@graphql-tools/merge');
const CategoryResolver = require('../categories/category.resolver');
const ClientResolver = require('../clients/client.resolver');
const ConceptResolver = require('../concepts/concept.resolver');
const ExpenseResolver = require('../expenses/expense.resolver');
const OrderResolver = require('../orders/orders.resolver');
const SearchStadistics = require('../stadistics/orders.search.resolver');
const ProductResolver = require('../products/products.resolver');
const ProviderResolver = require('../providers/provider.resolver');
const PurchaseResolver = require('../purchase/purchase.resolver');
const UserResolver = require('../users/users.resolver');
const boxResolver = require('../box/box.resolver');

const resolvers = [
  UserResolver,
  ClientResolver,
  // Orders
  OrderResolver,
  SearchStadistics,
  CategoryResolver,
  ProductResolver,
  // Expenses
  ExpenseResolver,
  ConceptResolver,
  ProviderResolver,
  PurchaseResolver,
  // Treaury
  boxResolver,
];

module.exports = mergeResolvers(resolvers);
