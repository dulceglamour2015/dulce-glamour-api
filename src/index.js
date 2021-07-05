const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const { apolloServer } = require('./server');
const { connectDB } = require('./utils/connectDB');
const { whiteList } = require('./config');
const pedidosRoute = require('./orders/orders.controller');

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
app.use(morgan('dev'));
app.set('trust proxy', 1);

app.use('/pedidos', pedidosRoute);

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
