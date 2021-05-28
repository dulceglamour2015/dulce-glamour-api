const { Usuario } = require('../../database/Usuario');
const {
  iniciarSesion,
  cerrarSesion,
  createToken,
} = require('../../utils/auth');

module.exports = {
  Query: {
    obtenerUsuario: async (_, __, ctx) => {
      return ctx.current;
    },
    obtenerUsuarios: async (_, __, ___) => {
      try {
        return await Usuario.find({}).sort({ _id: -1 });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },

    usuario: async (_, { id }) => {
      try {
        return await Usuario.findById(id);
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
  },

  Mutation: {
    nuevoUsuario: async (_, { id, input }) => {
      // En caso de que sea nuevo
      const existeUsuario = await Usuario.findOne({ username: input.username });
      if (existeUsuario) {
        throw new Error('Error el usuario ya existe!');
      }
      try {
        const usuario = new Usuario(input);
        usuario.id = usuario._id;
        await usuario.save();
        return usuario;
      } catch (error) {
        throw new Error('No se pudo crear el usuario');
      }
    },

    autenticarUsuario: async (_, { input }) => {
      const { username, password } = input;
      const usuario = await iniciarSesion({ username, password });

      return { token: createToken(usuario) };
    },

    eliminarUsuario: async (_, { id }) => {
      try {
        await Usuario.findByIdAndDelete(id);
        return 'Usuario eliminado';
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },

    actualizarUsuario: async (_, { id, input }) => {
      if (input.username) {
        const exist = await Usuario.findOne({ username: input.username });
        if (exist) throw new Error('Intenta con otro nombre');
      }

      try {
        return await Usuario.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
      } catch (error) {
        throw new Error('No se pudo actualizar al usuario');
      }
    },
  },
};
