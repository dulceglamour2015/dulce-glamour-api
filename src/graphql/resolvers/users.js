const {
  iniciarSesion,
  cerrarSesion,
  createToken,
} = require('../../utils/auth');
const {
  users,
  user,
  addUser,
  deleteUser,
  updateUser,
  updatePassword,
  getLastOrderSeller,
  getCurrentOrders,
  getIndicatorToday,
} = require('../../users/users.service');

module.exports = {
  Query: {
    obtenerUsuario: async (_, __, ctx) => {
      return ctx.current;
    },

    obtenerUsuarios: async (_, __, ___) => {
      return await users({ filter: {} });
    },

    usuario: async (_, { id }) => {
      return await user(id);
    },

    findLastOrderSeller: async (_, { id }, __, info) => {
      return await getLastOrderSeller(id, info);
    },

    findCurrentOrders: async (_, __, { current }, info) => {
      return await getCurrentOrders(info, current);
    },
    findIndicatorToday: async (_, { id }, { current }, info) => {
      return getIndicatorToday({ info, current, id });
    },
  },

  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      return await addUser(input);
    },

    autenticarUsuario: async (_, { input }) => {
      const { username, password } = input;
      const usuario = await iniciarSesion({ username, password });

      return { token: createToken(usuario) };
    },

    eliminarUsuario: async (_, { id }) => {
      return await deleteUser(id);
    },

    actualizarUsuario: async (_, { id, input }) => {
      return await updateUser(id, input);
    },

    setPassword: async (_, { id, password }) => {
      return await updatePassword(id, password);
    },
  },
};
