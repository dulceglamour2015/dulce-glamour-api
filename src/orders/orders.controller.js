const express = require('express');
const ejs = require('ejs');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

const { v4: uuidV4 } = require('uuid');
const { formattedDate } = require('../utils/formatDate');
const { Pedido } = require('./orders.model');
const { Cliente } = require('../clients/client.model');
const { Usuario } = require('../users/users.model');
const { formatPrice } = require('../utils/formatPrice');
const { randomUUID } = require('crypto');

router.get('/envios/:id', async (req, res) => {
  const id = req.params.id;
  const pedido = await Pedido.findById(id);
  const cliente = await Cliente.findById(pedido.cliente);
  const envioFile = 'envio-' + id + '.pdf';
  const directory = path.join('src', 'tmp', 'envios');

  ejs.renderFile(
    path.join(__dirname, '..', 'views', 'envios.ejs'),
    { cliente, pedido },
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
            stream.pipe(fs.createWriteStream(`./src/tmp/envios/${envioFile}`));
            stream.pipe(res);
          });
      }
    }
  );
});

router.get('/htmlPdf/:id', async (req, res) => {
  const id = req.params.id;
  const pedido = await Pedido.findById(id);
  const cliente = await Cliente.findById(pedido.cliente);
  const vendedor = await Usuario.findById(pedido.vendedor);
  const pedFile = 'pedido-' + id + '.pdf';
  const formatDate = formattedDate(pedido.createdAt);
  const formatId = id.slice(5, 15);
  const directory = path.join('src', 'tmp', 'pedidos');
  const total = pedido.total.toFixed(2);

  ejs.renderFile(
    path.join(__dirname, '..', 'views', 'report.ejs'),
    {
      pedido,
      formatDate,
      cliente,
      formatId,
      vendedor,
      total,
      formatPrice: formatPrice,
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
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
            stream.pipe(fs.createWriteStream(`./src/tmp/pedidos/${pedFile}`));
            stream.pipe(res);
          });
      }
    }
  );
});

router.post('/ordersToSend', (req, res) => {
  const { ids } = req.body;
  const id = uuidV4();
  const directory = path.join('src', 'tmp', 'ordersSend');
  const pedFile = 'reporte-envio' + id + '.pdf';
  if (!!ids) {
    Pedido.find({ _id: { $in: ids } }, (err, docs) => {
      if (err) console.log(err);

      ejs.renderFile(
        path.join(__dirname, '..', 'views', 'ordersToSend.ejs'),
        {
          pedidos: docs,
          cantidad: docs.length,
        },
        (error, data) => {
          if (error) {
            console.log(error);
            res.send(error);
          } else {
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
                stream.pipe(
                  fs.createWriteStream(`./src/tmp/ordersSend/${pedFile}`)
                );
                stream.pipe(res);
              });
          }
        }
      );
    });
  }
});

module.exports = router;
