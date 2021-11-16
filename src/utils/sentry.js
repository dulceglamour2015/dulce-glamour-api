const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const { ApolloError } = require('apollo-server-express');

module.exports = {
  pluginSentry: {
    requestDidStart(_) {
      return {
        didEncounterErrors(ctx) {
          if (!ctx.operation) return;

          for (const err of ctx.errors) {
            if (err instanceof ApolloError) {
              continue;
            }
            // Add scoped report details and send to Sentry
            Sentry.withScope((scope) => {
              // Annotate whether failing operation was query/mutation/subscription
              scope.setTag('kind', ctx.operation.operation);

              if (ctx.current) {
                scope.setUser({
                  username: ctx.context.current.username,
                });
              }

              // Log query and variables as extras (make sure to strip out sensitive data!)
              scope.setExtra('query', ctx.request.query);
              scope.setExtra('variables', ctx.request.variables);

              if (err.path) {
                // We can also add the path as breadcrumb
                scope.addBreadcrumb({
                  category: 'query-path',
                  message: err.path.join(' > '),
                  level: Sentry.Severity.Debug,
                });
              }

              const transactionId =
                ctx.request.http.headers.get('x-transaction-id');
              if (transactionId) {
                scope.setTransaction(transactionId);
              }

              Sentry.captureException(err);
            });
          }
        },
      };
    },
  },
};
