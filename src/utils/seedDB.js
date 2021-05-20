const path = require('path');
const fs = require('fs');

function seed(filename, model) {
  const directory = path.join(__dirname, '..', 'data', filename);
  fs.readFile(directory, 'utf8', (error, data) => {
    if (error) {
      console.error(error);
      return;
    }

    const json = JSON.parse(data);
    json.forEach(async function (obj) {
      const exist = await model.findOne({ nombre: obj.nombre });
      if (exist) throw new Error('El distrito ya esta registrado');
      const newDoc = new model(obj);

      try {
        await newDoc.save();
      } catch (error) {
        throw new Error('Error al guardar');
      }
    });
  });
}

module.exports = {
  seed
};
