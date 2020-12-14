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
      const { nombre, username, password, rol } = input;
      if (id) {
        try {
          const dbUsuario = await Usuario.findById(id);
          if (!dbUsuario) throw new Error('No existe el usuario');
          dbUsuario.nombre = nombre;
          dbUsuario.username = username;
          dbUsuario.password = password;
          dbUsuario.rol = rol;
          await dbUsuario.save();
          return dbUsuario;
        } catch (error) {
          throw new Error('❌Error! ❌');
        }
      }
      // En caso de que sea nuevo
      const existeUsuario = await Usuario.findOne({ username });
      if (existeUsuario) {
        throw new Error('El usuario ya esta registrado');
      }
      try {
        const usuario = new Usuario(input);
        usuario.id = usuario._id;
        await usuario.save();
        return usuario;
      } catch (error) {
        throw new Error('❌Error! ❌');
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
      const user = await Usuario.findById(id);
      if (!user) {
        throw new Error('El usuario no existe');
      }
      try {
        return await Usuario.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
      } catch (error) {}
    },
  },
};
