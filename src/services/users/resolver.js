const model = require('./model');

module.exports = {
  Query: {
    getLoginUser: async (_, __, ctx) => {
      return ctx.current;
    },

    getUser: async (_, { id }) => {
      return await model.getUser(id);
    },

    getPaginatedUsers: async (_, { page, search }) => {
      return await model.getUsers({ page, search });
    },

    getLastOrdersUser: async (_, { userId }) => {
      return await model.getLastOrdersUser(userId);
    },

    // Dashboard Queries
    getProductivityUser: async (_, { id }, { current }) => {
      return await model.getProductivityUser({ id, current });
    },

    getCurrentUserOrders: async (_, __, { current }, info) => {
      return await model.getCurrentUserOrders(current, info);
    },

    // Productivity Users Queries
    getProductivityUsersOrders: async (_, { date }) => {
      return await model.getProductivityUsersOrders(date);
    },
  },

  Mutation: {
    register: async (_, { input }) => {
      return await model.addUser(input);
    },

    login: async (_, { input }, { req }) => {
      return await model.login(input);
    },

    suspendUser: async (_, { id }, { current }) => {
      return await model.suspendUser(id, current);
    },

    activateUser: async (_, { id }) => {
      return await model.activateUser(id);
    },

    updateUser: async (_, { id, input }) => {
      return await model.updateUser(id, input);
    },

    setPassword: async (_, { id, password }) => {
      return await model.updatePassword(id, password);
    },

    logout: async (_, __, { req, res }) => {
      return new Promise((resolve) =>
        req.session.destroy((err) => {
          res.clearCookie('gid');
          if (err) {
            console.error(err);
            resolve(false);
            return;
          }

          resolve(true);
        })
      );
    },
  },
};
