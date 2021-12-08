const http = require('http');
const app = require('./app');
const {
  normalizePort,
  onError,
  onListening,
} = require('./utils/httpListeners');

// Normalize Port
const port = normalizePort(process.env.PORT || '3000');

// Set port in the express app
app.set('port', port);

// Create http server
const server = http.createServer(app);
server.listen(port);
server.on('error', (err) => onError(err, port));
server.on('listening', () => onListening(server));
