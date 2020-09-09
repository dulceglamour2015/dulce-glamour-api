const express = require('express');
const moment = require('moment');
const ejs = require('ejs');
const { Pedido } = require('../database/Pedido');
const { Cliente } = require('../database/Cliente');
const { Usuario } = require('../database/Usuario');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

router.get('/htmlPdf/:id', async (req, res) => {
  const id = req.params.id;
  const pedido = await Pedido.findById(id);
  const cliente = await Cliente.findById(pedido.cliente);
  const vendedor = await Usuario.findById(pedido.vendedor);
  const pedFile = 'pedido-' + id + '.pdf';
  moment.locale('es');
  const formatDate = moment(pedido.createdAt).format('LLL');
  const formatId = id.slice(5, 10);
  const directory = path.join('src', 'tmp');
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
            stream.pipe(fs.createWriteStream(`./src/tmp/${pedFile}`));
            stream.pipe(res);
          });
      }
    }
  );
});

module.exports = router;
