const { AuthenticationError } = require('apollo-server-express');
const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const { hashPassword, validatePassword } = require('../../utils/hashed');

const UsuariosSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    creado: {
      type: Date,
      default: Date.now(),
    },
    rol: {
      type: String,
      trim: true,
      required: true,
      default: 'USUARIO',
    },
  },
  { timestamps: true }
);

UsuariosSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

UsuariosSchema.pre('updateOne', async function (next) {
  const password = this._update['$set'].data.password;
  if (!password) return next();

  const newPassword = await hashPassword(password);
  this.set({ password: newPassword });
  next();
});

UsuariosSchema.methods.comparePassword = async function (pw) {
  if (!this.password) throw new Error('Falta data!');

  try {
    await validatePassword(pw, this.password);
    return this;
  } catch (error) {
    throw new AuthenticationError(
      'Credenciales Incorrectas, Intetalo de nuevo.'
    );
  }
};

module.exports.Usuario = model('Usuario', UsuariosSchema);
