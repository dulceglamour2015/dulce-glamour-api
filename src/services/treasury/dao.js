const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const { TreasuryResult } = require('./collection');
const dto = require('./dto');

module.exports = {
  getTreasuryResults: async () => {
    try {
      const treasuries = await TreasuryResult.find().sort({ _id: -1 });

      return dto.multiple(treasuries);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  createTreasuryResult: async ({ input }) => {
    try {
      const treasury = new TreasuryResult(input);

      await treasury.save();

      return dto.single(treasury);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  deleteTreasury: async ({ id, userId }) => {
    try {
      await TreasuryResult.deleteById(id, userId);

      return 'Registro eliminado correctamente.';
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
};
