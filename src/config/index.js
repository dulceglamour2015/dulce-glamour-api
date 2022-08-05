const getPaginateOptions = require('./paginationsOptions');
const getPaginationParams = require('./paginationParams');

const { NODE_ENV, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const IN_PROD = NODE_ENV === 'production';

const DB_URI = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(
  DB_PASSWORD
)}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

const DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const APOLLO_OPTIONS = {
  playground: IN_PROD
    ? false
    : {
        settings: {
          'request.credentials': 'include',
        },
      },
};

const whiteList = [
  'https://dglamour-client.vercel.app',
  'https://dg-shopping.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://dglamour-ui.vercel.app',
  'https://www.dulceglamour.net',
  'https://studio.apollographql.com',
  'https://demo-crm.vercel.app',
  'https://www.dulce-glamour.com',
  'https://dulce-glamour.com',
];

module.exports = {
  DB_URI,
  DB_OPTIONS,
  APOLLO_OPTIONS,
  whiteList,
  IN_PROD,
  corsOpts: {
    origin: whiteList,
    credentials: true,
  },
  helmentOpts: {
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production' ? undefined : false,
  },
  getPaginateOptions,
  getPaginationParams,
};
