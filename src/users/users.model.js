const { Schema, model } = require('mongoose');
const { hashPassword, validatePassword } = require('../utils/hashed');

const UsuariosSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    creado: {
      type: Date,
      default: Date.now()
    },
    rol: {
      type: String,
      trim: true,
      required: true,
      default: 'USUARIO'
    }
  },
  { timestamps: true }
);

UsuariosSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    return next(error);
  }
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
  await validatePassword(pw, this.password);
  return this;
};

module.exports.Usuario = model('Usuario', UsuariosSchema);
