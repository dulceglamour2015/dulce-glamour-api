const { mergeResolvers } = require('@graphql-tools/merge');
const CategoryResolver = require('../services/categories/resolver');
const ClientResolver = require('../services/clients/resolver');
const ConceptResolver = require('../services/concepts/resolver');
const ExpenseResolver = require('../services/expenses/resolver');
const OrderResolver = require('../services/orders/resolver');
const SearchStadistics = require('../services/stadistics/resolver');
const ProductResolver = require('../services/products/resolver');
const ProviderResolver = require('../services/providers/resolver');
const PurchaseResolver = require('../services/purchase/purchase.resolver');
const UserResolver = require('../services/users/resolver');
const BoxResolver = require('../services/box/resolver');
const TreasuryResolver = require('../services/treasury/resolver');
const EOrderResolver = require('../services/e-orders/resolver');

const resolvers = [
  UserResolver,
  ClientResolver,
  OrderResolver,
  EOrderResolver,
  SearchStadistics,
  CategoryResolver,
  ProductResolver,
  ExpenseResolver,
  ConceptResolver,
  ProviderResolver,
  PurchaseResolver,
  TreasuryResolver,
  BoxResolver,
];

module.exports = mergeResolvers(resolvers);
