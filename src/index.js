const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { apolloServer } = require('./server');
const { connectDB } = require('./database');
const pedidosRoute = require('./routes/pedidos');
const { graphqlUploadExpress } = require('graphql-upload');
// CONFIG VARIABLES

// DB Connect
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const whiteList = [
  'https://dglamour-client.vercel.app',
  'http://localhost:3000',
  'https://dglamour-ui.vercel.app',
  'https://www.dulceglamour.net',
  'https://studio.apollographql.com',
];

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

const dir = path.join(process.cwd(), 'images');
app.use(express.static(dir));
app.use('/images', express.static(dir));

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

// CONNECT APOLLO WITH EXPRESS
apolloServer.applyMiddleware({ app, cors: false });

app.listen(process.env.PORT, () => {
  console.log(
    `Server running: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  );
});
