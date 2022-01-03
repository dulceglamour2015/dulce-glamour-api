const router = require('express').Router();
const { Products } = require('./products.model');

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (q) {
    try {
      const products = await Products.find({
        existencia: { $gt: 10 },
        activo: true,
        nombre: { $not: { $regex: /^TEST \d/ } },
      });

      const filterProducts = products.filter((product) =>
        product.nombre.toLowerCase().includes(q.toLowerCase())
      );

      return res.status(200).json(filterProducts);
    } catch (error) {
      console.log(error);
      return res.status(400).json([]);
    }
  }

  return res.status(404).json([]);
});

module.exports = router;
