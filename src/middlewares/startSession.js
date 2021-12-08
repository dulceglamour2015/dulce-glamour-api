const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { IN_PROD, DB_URI } = require('../config');

const store = new MongoDBStore({
  uri: DB_URI,
  collection: 'userSessions',
});

module.exports = {
  startSession: () => {
    return session({
      name: 'gid',
      secret: 'some-super-secret-string',
      saveUninitialized: false,
      resave: false,
      store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        sameSite: 'lax',
        secure: IN_PROD,
        domain: IN_PROD ? '.dulceglamour.net' : undefined,
      },
    });
  },
};
