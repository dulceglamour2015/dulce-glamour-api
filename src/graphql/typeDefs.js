const { mergeTypeDefs } = require('@graphql-tools/merge');
const UserType = require('../services/users/type');
const ClientType = require('../services/clients/type');
const CategoryType = require('../services/categories/type');
const ProductType = require('../services/products/type');
const OrderType = require('../services/orders/type');
const EOrderType = require('../services/e-orders/type');
const SearchType = require('../services/stadistics/type');
const ConceptType = require('../services/concepts/type');
const ExpenseType = require('../services/expenses/expense.type');
const ProviderType = require('../services/providers/type');
const PurchaseType = require('../services/purchase/purchase.type');
const BoxType = require('../services/box/type');

const root = `
    directive @auth on FIELD_DEFINITION
    directive @hasRole(roles: [String!]) on FIELD_DEFINITION
    directive @guest on FIELD_DEFINITION

    scalar Upload

    type Query {
      _: String
    }

    type Mutation {
      _: String
    }

    type PageInfo {
      totalPages: Int!
      totalDocs: Int!
      nextPage: Int
      prevPage: Int
      hasNextPage: Boolean!
      hasPrevPage: Boolean!
      offset: Int
    }
`;

const typeDefs = [
  root,
  UserType,
  ClientType,
  CategoryType,
  ProductType,
  OrderType,
  EOrderType,
  SearchType,
  ConceptType,
  ExpenseType,
  ProviderType,
  PurchaseType,
  BoxType,
];

module.exports = mergeTypeDefs(typeDefs, { all: true });
