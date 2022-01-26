const cuid = require('cuid');
const pretty = require('pino-pretty');
const pino = require('pino')(pretty());

const logger = {
  async requestDidStart(ctx) {
    ctx.logger = pino.child({ requestId: cuid() });
    ctx.logger.info({
      operationName: ctx.request.operationName,
      username: ctx.context.current ? ctx.context.current.username : null,
      variables: ctx.request.variables,
    });

    return {
      didEncounterErrors({ logger, errors }) {
        errors.forEach((error) => logger.warn(error));
      },
    };
  },
};

module.exports = logger;
