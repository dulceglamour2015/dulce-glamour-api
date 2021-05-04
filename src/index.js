const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { apolloServer } = require('./server');
const { connectDB } = require('./database');
const pedidosRoute = require('./routes/pedidos');
const fs = require('fs');
const { District } = require('./database/District');
// CONFIG VARIABLES

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const whiteList = [
  'https://dglamour-client.vercel.app',
  'http://localhost:3000',
  'https://dglamour-ui.vercel.app',
  'https://www.dulceglamour.net',
  'https://studio.apollographql.com'
];

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: whiteList,
    credentials: true
  })
);
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production' ? undefined : false
  })
);
app.use(morgan('dev'));
app.set('trust proxy', 1);

app.use('/pedidos', pedidosRoute);

// DB Connect
connectDB();

// CONNECT APOLLO WITH EXPRESS
apolloServer.applyMiddleware({ app, cors: false });

app.listen(process.env.PORT, () => {
  console.log(
    `Server running: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  );
});
