const { mergeResolvers } = require('@graphql-tools/merge');
const CategoryResolver = require('../services/categories/resolver');
const ClientResolver = require('../services/clients/resolver');
const ConceptResolver = require('../services/concepts/resolver');
const ExpenseResolver = require('../services/expenses/expense.resolver');
const OrderResolver = require('../services/orders/orders.resolver');
const SearchStadistics = require('../services/stadistics/orders.search.resolver');
const ProductResolver = require('../services/products/resolver');
const ProviderResolver = require('../services/providers/resolver');
const PurchaseResolver = require('../services/purchase/purchase.resolver');
const UserResolver = require('../services/users/resolver');
const BoxResolver = require('../services/box/resolver');
const eOrderResolver = require('../services/e-orders/e-order.resolver');

const resolvers = [
  UserResolver,
  ClientResolver,
  // Orders
  OrderResolver,
  eOrderResolver,
  SearchStadistics,
  CategoryResolver,
  ProductResolver,
  // Expenses
  ExpenseResolver,
  ConceptResolver,
  ProviderResolver,
  PurchaseResolver,
  // Treaury
  BoxResolver,
];

module.exports = mergeResolvers(resolvers);
