const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const { apolloServer } = require('./server');
const { connectDB } = require('./utils/connectDB');
const { whiteList } = require('./config');
const pedidosRoute = require('./orders/orders.controller');
const { seed } = require('./utils/seedDB');
const { Test } = require('./pruebas/test.model');
const { rows } = require('./data/mockData');
const { Products } = require('./products/products.model');
const { Cliente } = require('./clients/client.model');

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

  // Middlewares
  app.use(
    cors({
      origin: whiteList,
      credentials: true,
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
  app.set('trust proxy', 1);

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
  connectDB().then(() => {
    //Start Server
    app.listen(process.env.PORT, () => {
      console.log(
        `Server running: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
      );
    });
  });
};

main().catch((error) => console.error(error));
