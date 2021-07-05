const { mergeTypeDefs } = require('@graphql-tools/merge');
const UserType = require('../users/users.type');
const ClientType = require('../clients/client.type');
const CategoryType = require('../categories/category.type');
const ProductType = require('../products/products.type');
const OrderType = require('../orders/orders.type');
const SearchType = require('../orders/search.type');
const ConceptType = require('../concepts/concept.type');
const ExpenseType = require('../expenses/expense.type');
const ProviderType = require('../providers/provider.type');
const PurchaseType = require('../purchase/purchase.type');

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
      hasNextPage: Boolean
      hasPrevPage: Boolean
      prev: Int
      next: Int
    }
`;

const typeDefs = [
  root,
  UserType,
  ClientType,
  CategoryType,
  ProductType,
  OrderType,
  SearchType,
  ConceptType,
  ExpenseType,
  ProviderType,
  PurchaseType,
];

module.exports = mergeTypeDefs(typeDefs, { all: true });
