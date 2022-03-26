const _ = require('lodash');
const { Usuario } = require('../services/users/collection');

async function addMember() {
  const users = await Usuario.find({ name: { $exists: false } });

  if (!users) throw new Error('All docs have member');

  for await (const user of users) {
    const dbUser = await Usuario.findById(user._id);
    dbUser.name = dbUser.nombre;

    await dbUser.save();
  }
}

async function renamePropertie() {
  return await Usuario.updateMany({}, { rol: 'role' }, { multi: true });
}

async function unsetPropertie({ query, callback, propertie }) {
  Usuario.updateMany(query, { $unset: propertie }, callback);
}

module.exports = { addMember, renamePropertie, unsetPropertie };
