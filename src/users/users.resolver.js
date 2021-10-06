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
} = require('./users.service');
const { iniciarSesion, createToken } = require('../utils/auth');
const { Usuario } = require('./users.model');

module.exports = {
  Query: {
    obtenerUsuario: async (_, __, ctx) => {
      if (!ctx.req.session.userId) {
        return null;
      }

      return Usuario.findById(ctx.req.session.userId);
      // console.log(ctx.current);
      // if (!ctx.current) {
      //   throw new Error('Debes iniciar sesión');
      // }
      // return ctx.current;
    },

    obtenerUsuarios: async (_, __, { res }) => {
      return await users({ filter: {} });
    },

    usuario: async (_, { id }) => {
      return await user(id);
    },

    // Query para la seccion de ver usuario
    findLastOrderSeller: async (_, { id }, __, info) => {
      return await getLastOrderSeller(id, info);
    },

    // Query para la pagina inicial
    findCurrentOrders: async (_, __, { current }, info) => {
      return await getCurrentOrders(info, current);
    },

    // Query para el chart de usuario, solo el del dia actual
    findIndicatorToday: async (_, { id }, { current }, info) => {
      return getIndicatorToday({ info, current, id });
    },
  },

  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      return await addUser(input);
    },

    autenticarUsuario: async (_, { input }, { req }) => {
      const { username, password } = input;
      const usuario = await iniciarSesion({ username, password });

      req.session.userId = usuario.id;

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
