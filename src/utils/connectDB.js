const mongoose = require('mongoose');
const { DB_OPTIONS, DB_URI } = require('../config');

module.exports = {
  connectDB: async () => {
    try {
      console.log(DB_URI);
      await mongoose.connect(DB_URI, DB_OPTIONS);
    } catch (error) {
      console.log('Hubo un error al conectar la BD');
      console.log(error);
      process.exit(1);
    }
  },
};
