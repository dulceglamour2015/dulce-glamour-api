const express = require('express');
const app = express();
const path = require('path');
const cluster = require('cluster');
const numCpus = require('os').cpus().length;
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

  // Migrations
  // const update = await Categoria.updateMany(
  //   { images: { $exists: false } },
  //   { images: [] }
  // );
  // console.log(update);
  // Categoria.find({ images: { $exists: false } }, (error, docs) => {
  //   if (error) console.error(error);

  //   console.log(docs.length);
  // });

  if (cluster.isMaster) {
    for (let i = 0; i < numCpus; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      cluster.fork();
    });
  } else {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server ${process.pid} running: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
      );
    });
  }
  // app.listen(process.env.PORT, () => {
  //   console.log(
  //     `Server running: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  //   );
  // });
};

main().catch((error) => console.error(error));
