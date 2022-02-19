const model = require('./model');

module.exports = {
  Query: {
    obtenerUsuario: async (_, __, ctx) => {
      return ctx.current;
    },

    obtenerUsuarios: async () => {
      return await model.getUsers();
    },

    usuario: async (_, { id }) => {
      return await model.getUser(id);
    },

    // Query para la seccion de ver usuario
    findOrdersUser: async (_, { id }, __, info) => {
      return await model.getOrdersUser(id, info);
    },

    // Query para la pagina inicial
    findCurrentOrders: async (_, __, { current }, info) => {
      return await model.getCurrentOrders(current, info);
    },

    // Query para el chart de usuario, solo el del dia actual
    findIndicatorToday: async (_, { id }, { current }, info) => {
      return model.getIndicatorToday(current, id);
    },

    findProductivityOrdersUsers: async (_, { date }) => {
      return await model.getProductivityOrdersUsers(date);
    },

    getLastOrdersUser: async (_, { userId }) => {
      return await model.getLastOrdersUser(userId);
    },
  },

  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      return await model.addUser(input);
    },

    autenticarUsuario: async (_, { input }, { req }) => {
      const token = model.login({
        username: input.username,
        password: input.password,
      });

      // req.session.userId = usuario.id;

      return { token };
    },

    eliminarUsuario: async (_, { id }) => {
      return await model.deleteUser(id);
    },

    actualizarUsuario: async (_, { id, input }) => {
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
