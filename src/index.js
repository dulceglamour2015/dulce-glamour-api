const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { apolloServer } = require('./server');
const { connectDB } = require('./database');
const pedidosRoute = require('./routes/pedidos');
// CONFIG VARIABLES
const { PORT } = require('./config');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ['https://dglamour-client.vercel.app', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('common'));
app.set('trust proxy', 1);

app.use('/pedidos', pedidosRoute);

// DB Connect
connectDB();

// CONNECT APOLLO WITH EXPRESS
apolloServer.applyMiddleware({ app, cors: false });

app.listen(+PORT || 4000, () => {
  console.log(
    `Server running: http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
});
