const { NODE_ENV, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, PROD_URL } =
  process.env;

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
  'http://localhost:3000',
  'https://dglamour-ui.vercel.app',
  'https://www.dulceglamour.net',
  'https://studio.apollographql.com',
  'https://demo-crm.vercel.app',
];

module.exports = {
  DB_URI,
  DB_OPTIONS,
  APOLLO_OPTIONS,
  PROD_URL,
  whiteList,
  IN_PROD,
};
