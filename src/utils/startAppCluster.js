const cluster = require('cluster');
const numCpus = require('os').cpus().length;

module.exports = {
  startAppCluster: (app) => {
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
          `Server HTTP ${process.pid} running: http://localhost:${process.env.PORT}
           Server Graphql ${process.pid} running: http://localhost:${process.env.PORT}/graphql
          `
        );
      });
    }
  },
};
