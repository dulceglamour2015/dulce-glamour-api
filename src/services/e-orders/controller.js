const router = require('express').Router();
const path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');

const { EOrder } = require('./collection');
const { formatPrice } = require('../../utils/formatPrice');
const { formattedDate } = require('../../utils/formatDate');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');

router.get('/eorder-pdf/:id', async (req, res) => {
  const id = req.params.id;
  const order = await EOrder.findById(id);

  if (!order) handleErrorResponse({ errorMsg: 'Order not found' });

  const pedFile = 'eorder-' + id + '.pdf';
  const directory = path.join('src', 'tmp', 'eorders');
  const formatDate = formattedDate(order.createdAt);
  const client = order.client;
  const shipping = order.shipping;
  const shippingCost = +order.shippingTotal;
  const discount = +order.discount;

  ejs.renderFile(
    path.join(__dirname, '..', '..', 'views', 'eorder.ejs'),
    {
      order,
      formatDate,
      client,
      shipping,
      shippingCost,
      discount,
      formatPrice: formatPrice,
    },
    (error, data) => {
      if (error) {
        handleErrorResponse({ errorMsg: error });
      }
      const html = data;
      pdf
        .create(html, { directory, type: 'pdf', format: 'A4' })
        .toStream((error, stream) => {
          if (error) return res.end(error.stack);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader(
            'Content-Disposition',
            'inline; filename="' + pedFile + '"'
          );
          stream.pipe(fs.createWriteStream(`./src/tmp/eorders/${pedFile}`));
          stream.pipe(res);
        });
    }
  );
});

router.get('/eorder-shipping/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const order = await EOrder.findById(id);
    const envioFile = 'eorder-' + id + '.pdf';
    const directory = path.join('src', 'tmp', 'envios');

    ejs.renderFile(
      path.join(__dirname, '..', '..', 'views', 'eorderShipping.ejs'),
      { order },
      (error, data) => {
        if (error) {
          return res.send(error);
        } else {
          const html = data;
          pdf
            .create(html, {
              directory,
              type: 'pdf',
              height: '29.7cm',
              width: '21cm',
            })
            .toStream((error, stream) => {
              if (error) return res.end(error.stack);
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader(
                'Content-Disposition',
                'inline; filename="' + envioFile + '"'
              );
              stream.pipe(
                fs.createWriteStream(`./src/tmp/envios/${envioFile}`)
              );
              stream.pipe(res);
            });
        }
      }
    );
  } catch (error) {
    handleErrorResponse({ errorMsg: error });
  }
});

module.exports = router;
