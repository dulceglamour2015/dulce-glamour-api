const { Cliente } = require('./src/services/clients/collection');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const fs = require('fs');

async function createClientCSV() {
  const csvWriter = createCsvWriter({
    path: 'data.csv',
    header: [{ id: 'phone', title: 'Mobile Device ID' }],
  });

  const clientWithPhone = await Cliente.find({ telefono: { $exists: true } })
    .select('_id telefono')
    .lean();

  const records = clientWithPhone.map((c) => {
    const phone = `593${c.telefono}`;
    return {
      phone,
    };
  });

  console.log({ records });

  csvWriter.writeRecords(records);
}

module.exports = { createClientCSV };
