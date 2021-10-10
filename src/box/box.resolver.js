const { Box } = require('./box.model');

module.exports = {
  Query: {
    getBox: async (_, { id }) => {
      try {
        return await Box.findById(id);
      } catch (error) {
        throw new Error('Cannot get box');
      }
    },
    getAllBox: async () => {
      try {
        return await Box.find();
      } catch (error) {
        throw new Error('Cannot get Boxes');
      }
    },
  },

  Mutation: {
    createBox: async (_, { input }) => {
      try {
        const newBox = new Box(input);
        newBox.id = newBox._id;

        await newBox.save();

        return newBox;
      } catch (error) {
        throw new Error('Cannot create box');
      }
    },
    updateBox: async (_, { id, input }) => {
      try {
        return await Box.findByIdAndUpdate(id, input, { new: true });
      } catch (error) {
        throw new Error('Cannot update box');
      }
    },
    deleteBox: async (_, { id }) => {
      try {
        await Box.findByIdAndDelete(id);
        return 'Deleted Succesfully';
      } catch (error) {
        throw new Error('Cannot delete Box');
      }
    },
  },
};
