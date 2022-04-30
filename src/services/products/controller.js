const router = require('express').Router();
const { Products } = require('./collection');

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (q) {
    try {
      const products = await Products.find({
        $and: [
          { existencia: { $gt: 10 } },
          { deleted: false },
          { nombre: { $not: { $regex: /^TEST \d/ } } },
        ],
        $text: { $search: q },
      });

      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      return res.status(400).json([]);
    }
  }

  return res.status(404).json([]);
});

module.exports = router;
