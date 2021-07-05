const { Usuario } = require('./users.model');
const { loaderFactory } = require('../utils/loaderFactory');
const { findAllOrders } = require('../orders/orders.lib');
const { getMongooseSelectionFromReq } = require('../utils/selectFields');

async function users({ filter, sort = { _id: -1 } }) {
  try {
    return await Usuario.find(filter).sort(sort);
  } catch (error) {
    throw new Error('No se pudieron obtener los usuarios');
  }
}

async function user(id) {
  try {
    return await Usuario.findById(id);
  } catch (error) {
    throw new Error(`No se pudo obtener al usuario con id ${id}`);
  }
}

async function addUser(input) {
  const exist = await Usuario.findOne({ username: input.username });
  if (exist) {
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
}

async function deleteUser() {
  try {
    await Usuario.findByIdAndDelete(id);
    return 'Usuario eliminado';
  } catch (error) {
    throw new Error('❌Error! ❌');
  }
}

async function updateUser(id, input) {
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
}

async function updatePassword(id, password) {
  try {
    const user = await Usuario.findById(id);
    if (user) {
      user.password = password;
      await user.save();
      return 'Contraseña modificada';
    }
  } catch (error) {
    throw new Eror('No se pudo modificar la contraseña');
  }
}

async function orderSeller(parent, loader) {
  try {
    return await loaderFactory(loader, Usuario, parent);
  } catch (error) {
    throw new Error('Error al cargar usuarios');
  }
}

async function getLastOrderSeller(userId, info) {
  const fields = getMongooseSelectionFromReq(info);
  try {
    return await findAllOrders(
      { estado: 'PAGADO', vendedor: userId },
      { fields, limit: 20 }
    );
  } catch (error) {
    throw new Error('No se encontraron los pedidos!');
  }
}

async function getCurrentOrders(info, current) {
  const fields = getMongooseSelectionFromReq(info);
  try {
    return await findAllOrders({ vendedor: current.id }, { fields, limit: 8 });
  } catch (error) {
    throw new Error('No se encontraron los pedidos!');
  }
}

async function getIndicatorToday({ info, current, id }) {
  const fields = getMongooseSelectionFromReq(info);
  let queryObj = {};
  const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(
    new Date().setUTCHours(23, 59, 59, 999)
  ).toISOString();

  queryObj.createdAt = {
    $gte: startOfDay,
    $lt: endOfDay,
  };

  queryObj.estado = 'PAGADO';
  queryObj.vendedor = id ? id : current.id;

  try {
    return await findAllOrders(queryObj, { fields, sort: { createdAt: 1 } });
  } catch (error) {
    throw new Error('No se encontraron los pedidos!');
  }
}

module.exports = {
  users,
  user,
  addUser,
  deleteUser,
  updateUser,
  updatePassword,
  orderSeller,
  getLastOrderSeller,
  getCurrentOrders,
  getIndicatorToday,
};
