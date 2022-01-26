'use strict';
const path = require('path');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const Sentry = require('@sentry/node');

const routes = require('./routes');
const { corsOpts, helmentOpts } = require('./config');
const { apolloServer } = require('./server');
const { connectDB } = require('./utils/connectDB');
const { startSentry } = require('./middlewares/sentry');
const { startSession } = require('./middlewares/startSession');

const app = express();

startSentry(app);

// Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(compression());
app.set('trust proxy', 1);
app.use(cors(corsOpts));
app.use(startSession());
app.use(helmet(helmentOpts));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(morgan('common'));
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Routes
app.use(routes);

// Error Middleware
app.use(Sentry.Handlers.errorHandler());

// CONNECT APOLLO WITH EXPRESS
apolloServer.applyMiddleware({ app, cors: false });

// DB Connect
connectDB();

module.exports = app;
