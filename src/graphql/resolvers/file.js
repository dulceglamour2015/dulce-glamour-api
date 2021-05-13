const { GraphQLUpload } = require('apollo-server-express');
const { uploadFile } = require('../../services/fileService');

module.exports = {
  Mutation: {
    uploadFile: async (_, { file }) => {
      return await uploadFile(file);
    }
  }
};
