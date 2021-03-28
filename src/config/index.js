const { NODE_ENV, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const IN_PROD = NODE_ENV === 'production';

const DB_URI = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(
  DB_PASSWORD
)}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

const DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

const APOLLO_OPTIONS = {
  playground: IN_PROD
    ? false
    : {
        settings: {
          'request.credentials': 'include'
        }
      }
};

module.exports = {
  DB_URI,
  DB_OPTIONS,
  APOLLO_OPTIONS
};
