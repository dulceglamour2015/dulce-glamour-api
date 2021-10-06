const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const compression = require('compression');

const { apolloServer } = require('./server');
const { connectDB } = require('./utils/connectDB');
const { whiteList, IN_PROD, DB_URI } = require('./config');
const pedidosRoute = require('./orders/orders.controller');
const { Concept } = require('./concepts/concept.model');

const store = new MongoDBStore({
  uri: DB_URI,
  collection: 'userSessions',
});

const main = async () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(compression());

  // Middlewares
  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: whiteList,
      credentials: true,
    })
  );
  app.use(
    session({
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
    })
  );
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    })
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(morgan('dev'));

  // Sentry applyMiddlewares
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  // Routes
  app.use('/orders', pedidosRoute);

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  // CONNECT APOLLO WITH EXPRESS
  apolloServer.applyMiddleware({ app, cors: false });

  // DB Connect
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log(
      `Server running: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
  });
};

main().catch((error) => console.error(error));
